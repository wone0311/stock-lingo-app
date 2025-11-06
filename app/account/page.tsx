'use client';

import React, { useState, useEffect } from 'react';

// window 객체에 google 네임스페이스를 사용하기 위한 타입 확장 (TypeScript)
declare global {
  interface Window {
    google?: any; // google 객체
  }
}

const LoginPage: React.FC = () => {
  // 1. isClient 문제 해결
  //    useEffect에서 true로 설정하여 클라이언트 렌더링을 보장합니다.
  const [isClient, setIsClient] = useState(false);

  // 2. 새로운 Google Identity Services(GIS) 스크립트 로드
  useEffect(() => {
    // 클라이언트에서만 실행되도록 설정
    setIsClient(true);

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      // 스크립트 로드 완료 후 Google 버튼 초기화
      initializeGoogleButton();
    };
    document.body.appendChild(script);

    // 컴포넌트 언마운트 시 스크립트 제거 (선택 사항)
    return () => {
      document.body.removeChild(script);
    };
  }, []); // 빈 배열: 컴포넌트 마운트 시 1회 실행

  // 3. Google 로그인 버튼 초기화 함수 (새로운 방식)
  const initializeGoogleButton = () => {
    if (!window.google) {
      console.error("Google GSI 스크립트가 로드되지 않았습니다.");
      return;
    }

    window.google.accounts.id.initialize({
      // 🚨 [중요!] 'YOUR_GOOGLE_CLIENT_ID...' 이 부분은 *절대* 이대로 사용하면 안 됩니다.
      // 1. 이것은 '자리 표시자'일 뿐, 실제 ID가 아닙니다.
      // 2. 사용자님께서 Google Cloud Console(구글 클라우드 콘솔)에 접속하셔서
      //    'OAuth 2.0 클라이언트 ID'를 직접 발급받으셔야 합니다.
      // 3. 발급받은 실제 ID (예: 12345-abcde.apps.googleusercontent.com)를
      //    이 아랫줄의 'YOUR_GOOGLE_CLIENT_ID...' 부분에 복사해서 덮어쓰세요.
      // 4. 이 ID가 없거나 잘못되면 로그인이 작동하지 않습니다.
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
        // 로그인 성공 후 페이지 리디렉션이나 추가 처리
        // 예: window.location.href = '/dashboard';
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

      {/*
        [수정]
        기존 <button> 대신 이 div에 Google 버튼이 렌더링됩니다.
        스타일링은 구글에서 제공하는 옵션으로 조절하거나,
        div를 감싸는 wrapper를 만들어 중앙 정렬할 수 있습니다.
      */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
        
        {/* 구글 로그인 버튼이 여기에 삽입됩니다. */}
        <div id="google-login-button"></div>

      </div>

      <div>
        <a href="/login/email" style={{ marginTop: '20px', fontSize: '16px', color: '#007bff', textDecoration: 'none' }}>
          이메일로 시작하기 &gt;
        </a>
      </div>
    </div>
  );
};

export default LoginPage;