import React, { useEffect } from 'react';

const LoginPage: React.FC = () => {
  useEffect(() => {
    // 구글 로그인 스크립트를 페이지에 로드합니다.
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.onload = () => {
      // 스크립트가 로드되면 실행될 함수
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // 실제 클라이언트 ID로 교체
        });
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleLogin = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser: any) => {
      const idToken = googleUser.getAuthResponse().id_token;

      // 로그인 후 백엔드로 토큰을 전송합니다.
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
    });
  };

  return (
    <div>
      <h2>Google Login</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
