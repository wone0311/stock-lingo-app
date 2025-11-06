'use client';  // 이 파일은 클라이언트 컴포넌트로 작동해야 하므로 추가

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const LoginPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);  // 클라이언트에서만 실행
  }, []);

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // 여기에 Google 로그인 처리 로직 추가
  };

  const handleNaverLogin = () => {
    console.log('Naver login clicked');
    // 여기에 Naver 로그인 처리 로직 추가
  };

  if (!isClient) {
    return null; // 클라이언트에서만 렌더링하도록 설정
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fff', padding: '20px' }}>
      <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: '#23e564ff' }}>Stocklingo</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Button 
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #000000',
            padding: '10px 20px',
            width: '500px',
            borderRadius:'5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          variant="ghost"
          onClick={handleGoogleLogin}
        >
          <img src="/google.png" alt="Google Logo" style={{ width: '24px', height: '24px', marginRight: '150px' }} />
          구글로 시작하기
        </Button>
      </div>

      <div>
        <a href="/login/email" style={{ marginTop: '20px', fontSize: '16px', color: '#007bff', textDecoration: 'none' }}>이메일로 시작하기 &gt;</a>
      </div>
    </div>
  );
};

export default LoginPage;
