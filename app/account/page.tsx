import React from 'react';

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // 여기에 Google 로그인 처리 로직 추가
  };

  const handleNaverLogin = () => {
    console.log('Naver login clicked');
    // 여기에 Naver 로그인 처리 로직 추가
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fff', padding: '20px' }}>
      <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: '#4B74FF' }}>NOL</h2>
      <p style={{ fontSize: '18px', margin: '20px 0' }}>새로운 NOL에서 더 많은 즐거움과 혜택을 만나보세요!</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            padding: '10px 20px',
            width: '300px',
            borderRadius: '30px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={handleNaverLogin}
        >

          네이버로 시작하기
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            padding: '10px 20px',
            width: '300px',
            borderRadius: '30px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={handleGoogleLogin}
        >
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
