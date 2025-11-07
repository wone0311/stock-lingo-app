'use client';

import React, { useState, useEffect } from 'react';

declare global { //전역에 선언(window 자체가 전역에 선언되서 그럼)
  interface Window {  //Window 속성에 추가
    google?: any; // google 객체를 추가, 있어도 되고 없어도 됨
  }
}

const LoginPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {  //화면 랜더링 이후에 특정 작업을 수행하도록 하는 애가 useEffect임, 서버에선 실행 안됨
    setIsClient(true);
    {/* react는 <scirpt></script>를 직접 못쓰게 막아서 아래와 같은 방식으로 이용해야 함.
        더불어 자바 스크립트가 코드를 수정하기 위해서는 html을 직접 조작 못하고 DOM을 통해서 가능함.
        근데 아래서 보면 알듯이 저렇게 쓰면 귀찮잖아. 그래서 react가 return에다가는 html처럼 써도 되게 해준거임. 그건 자기가 알아서 dom으로 바꿔줌*/}
    const script = document.createElement('script');   //dom api써서 부품 추가
    script.src = 'https://accounts.google.com/gsi/client';  //gsi/client 파일 가져와서 실행하라는 명령임
    script.async = true;
    script.onload = () => {
      // 스크립트 로드 완료 후 Google 버튼 초기화, onload 안쓰면 다운 전에 다음 코드가 실행되는 불상사가 생길 수 있음. 저걸 붙여서 loading 되면 실행함.
      initializeGoogleButton();
    };
    document.body.appendChild(script); //<body>에 <Script> 붙이라는 소리임. 삽입하는 순간 src에서 gsi/client 파일 가져오고 초기화 진행함.

    // LoginPage가 사라질때 제거해라.
    return () => {
      document.body.removeChild(script);
    };
  }, []); // 빈 배열: 컴포넌트 마운트 시 1회 실행

  // 3. Google 로그인 버튼 초기화 함수 (새로운 방식)
  const initializeGoogleButton = () => {
    if (!window.google) { //gsi/client 실행과정에서 window 객체에 google 속성이 만들어짐
      console.error("Google GSI 스크립트가 로드되지 않았습니다.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: '419224976055-910rlsqu1oi8i5lckd0ol4nm09obkf8i.apps.googleusercontent.com', // 🚨 본인의 클라이언트 ID로 꼭! 교체하세요.
      callback: handleGoogleLogin, // 로그인이 성공했을 때 호출될 콜백 함수
    });

    // 4. 로그인 버튼 렌더링
    //    'google-login-button' ID를 가진 div에 버튼을 그립니다.
    window.google.accounts.id.renderButton(
      document.getElementById('google-login-button'),
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '300', // 버튼 너비를 픽셀 단위로 설정
      }
    );

    // 원클릭 로그인(One Tap) UI (선택 사항이지만 권장됨)
    // window.google.accounts.id.prompt(); 
  };

  // 5. 로그인 성공 시 콜백 함수 (새로운 방식)
  //    gapi.auth2.signIn() 대신 콜백으로 ID 토큰을 직접 받습니다.
  const handleGoogleLogin = (response: any) => {
    // response.credential 이 ID 토큰입니다.
    const idToken = response.credential;
    console.log('Google ID Token:', idToken);

    // ID Token을 백엔드로 전송하여 로그인 처리
    fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Login Success:', data);
      })
      .catch((error) => {
        console.error('Login Error:', error);
      });
  };

  // 6. 클라이언트가 아니면 null 반환 (SSR 방지)
  if (!isClient) {
    return null;
  }

  // 7. UI 렌더링
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fff', padding: '20px' }}>
      <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: '#23e564ff' }}>Stocklingo</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
        {/* 구글 로그인 버튼이 여기에 삽입됩니다. */}
        <div id="google-login-button">구글 계정으로 시작하기</div>
      </div>
    </div>
  );
};

export default LoginPage;