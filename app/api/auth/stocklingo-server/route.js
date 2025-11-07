import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// 1. 로그인 페이지(LoginPage)의 클라이언트 ID와 "똑같은" ID를 여기에 적습니다.
const GOOGLE_CLIENT_ID = '419224976055-910rlsqu1oi8i5lckd0ol4nm09obkf8i.apps.googleusercontent.com';

// 2. .env.local 파일에서 설정한 비밀키를 가져옵니다.
//    (이름: JWT_SECRET, 비밀번호: THIS-IS-SUKWON-AND-SEOUNG-JAE...)
const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * TODO: 이 함수는 나중에 "진짜 DB(데이터베이스)" 연동 코드로 바꿔야 합니다.
 * 지금은 임시로 '가짜 DB' 역할을 합니다.
 */
async function findOrCreateUser(googleUser) {
  console.log("DB에서 사용자 찾는 중 (또는 새로 만드는 중):", googleUser.email);
  
  // 예: const user = await db.users.findOrCreate({ where: { email: googleUser.email } });
  
  // 지금은 임시로 DB에서 찾은 (또는 새로 만든) 사용자 정보를 반환합니다.
  return {
    id: `user_${googleUser.sub}`, // 구글 고유 ID를 우리 DB ID로 사용 (예시)
    email: googleUser.email,
    name: googleUser.name,
    // DB에서 가져온 사용자의 실제 교육 진도 (나중에 연동)
    clearedStageIds: [1], // 예시: 1단계는 이미 깼다고 가정
  };
}

// 3. 로그인 페이지의 fetch 요청을 처리하는 메인 함수
export async function POST(request) {
  if (!JWT_SECRET) {
    // 2단계에서 서버 재시작 안 했으면 여기서 에러 날 수 있음!
    throw new Error("JWT_SECRET이 .env.local 파일에 설정되지 않았습니다. 서버를 재시작하세요.");
  }

  try {
    // 4. 로그인 페이지(프론트엔드)가 보낸 idToken 받기
    const { idToken } = await request.json(); 

    // 5. 구글 서버에 "이 idToken 진짜인가요?"라고 물어보기 (검증)
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload(); // payload에 사용자 정보(이메일, 이름 등)가 들어있음

    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // 6. 우리 DB에서 이 사용자 정보로 회원가입/로그인 처리하기
    // (지금은 위에서 만든 '가짜 DB' 함수를 사용합니다)
    const user = await findOrCreateUser(payload);

    // 7. 우리 앱 전용 "로그인 증표(JWT)" 만들기
    //    (2단계에서 만든 "비밀 도장"으로 서명!)
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' } // 7일간 로그인 유지
    );

    // 8. "로그인 증표"를 브라우저의 '쿠키'에 저장하라고 명령
    cookies().set('auth_token', token, {
      httpOnly: true, // 자바스크립트로 접근 못하게 막는 보안 설정
      secure: process.env.NODE_ENV === 'production', // https에서만 전송
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/', // 웹사이트 전체에서 사용
    });

    // 9. 프론트엔드로 "로그인 성공!" 응답 보내기
    return NextResponse.json({ message: 'Login successful', user });

  } catch (error) {
    console.error('로그인 API 오류:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}