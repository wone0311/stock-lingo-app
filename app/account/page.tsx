'use client'; // 이 파일은 클라이언트 컴포넌트로 작동해야 하므로 추가

import React, { useState, useEffect } from 'react';

const LoginPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  // useEffect 훅으로 구글 API 스크립트 비동기 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js?onload=onGapiLoad';
    script.async = true;
    document.body.appendChild(script);

    // 구글 API가 로드된 후 onGapiLoad 함수 호출
    window.onGapiLoad = () => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // 실제 클라이언트 ID로 교체
        });
      });
    };
  }, []);

  const handleGoogleLogin = () => {
    const auth2 = window.gapi.auth2.getAuthInstance(); // 구글 로그인 인스턴스 가져오기
    auth2.signIn().then((googleUser: any) => {
      const idToken = googleUser.getAuthResponse().id_token; // 구글 ID 토큰 가져오기

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
        })
        .catch((error) => {
          console.error('Login Error:', error);
        });
    });
  };

  if (!isClient) {
    return null; // 클라이언트에서만 렌더링하도록 설정
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fff', padding: '20px' }}>
      <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: '#23e564ff' }}>Stocklingo</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #000000',
            padding: '10px 20px',
            width: '500px',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={handleGoogleLogin} // 구글 로그인 처리 함수 호출
        >
          <img src="/google.png" alt="Google Logo" style={{ width: '24px', height: '24px', marginRight: '150px' }} />
          구글로 시작하기
        </button>
      </div>

      <div>
        <a href="/login/email" style={{ marginTop: '20px', fontSize: '16px', color: '#007bff', textDecoration: 'none' }}>이메일로 시작하기 &gt;</a>
      </div>
    </div>
  );
};

export default LoginPage;
