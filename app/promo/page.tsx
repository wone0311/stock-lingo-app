'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Page() {
  const [progress, setProgress] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // 정답: 스크린샷처럼 $130 하단 파란선 → "지지"
  const handleAnswer = (choice: '지지' | '저항') => {
    if (answered) return
    const correct = choice === '지지'  // == 의 뜻이면서 동시에 타입도 맞는지 확인
    setIsCorrect(correct)
    setAnswered(true)
    setProgress(100)
  }

  // 자주 쓰는 색상(대략 Tailwind 근사치)
  const COLORS = {
    slate900: '#0f172a',
    slate800: '#1f2937',
    slate700: '#334155',
    slate200: '#e2e8f0',
    emerald700: '#047857',
    emerald600: '#059669',
    emerald500: '#10b981',
    green500: '#22c55e',
    rose600: '#e11d48',
    white: '#ffffff',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.white,
        color: COLORS.slate900,
      }}
    >
      {/* 상단 헤더(그라데이션 + 아이콘) */}
      <header
        style={{
          position: 'relative',
          height: 144,
          background: `linear-gradient(to bottom, ${COLORS.emerald500}, ${COLORS.green500})`,
        }}
      >
        <Image
          src="/stock-icon-v1.png" // public/stock-icon.png
          alt="StockLingo"
          width={72}
          height={72}
          priority  //이 이미지를 우선 로딩
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            width: 56,
            height: 56,
            borderRadius: 16,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -24, // bottom-[-24px]
          }}
        >
          <div
            style={{
              height: 48,
              backgroundColor: COLORS.white,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            }}
          />
        </div>
      </header>

      <main
        style={{
          maxWidth: 384,
          margin: '0 auto',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 40,
          paddingBottom: 80,
        }}
      >
        {/* 진행도 바 */}
        <div
          style={{
            display: 'flex',    //안에 요소들을 가로로 한 줄 배치함
            alignItems: 'center',
            gap: 12,  //자식들 사이 간격
            marginBottom: 24,
          }}
        >
          <div
            style={{
              flex: 1,   //옆의 아이템들을 제외한 남은 공간을 모두 자기가 차지
              height: 16,
              backgroundColor: COLORS.slate200,
              borderRadius: 9999,
              overflow: 'hidden', // 안에 자식이 넘치면 그 부분은 없애기
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: COLORS.emerald700,
                width: `${progress}%`,
                transition: 'all 0.5s ease',
              }}
            />
          </div>
          <div
            style={{
              width: 48,
              textAlign: 'right',
              fontSize: 14,
              color: COLORS.slate700,
            }}
          >
            {progress}%
          </div>
        </div>

        {/* 문제 문구 */}
        <h1
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1.6, //줄 간격을 1.6배로 설정
            marginBottom: 20,
          }}
        >
          다음 차트는{' '}
          <span style={{ fontWeight: 900 }}>$130</span> 부근에서
          <br />
          <span style={{ textDecoration: 'underline', textDecorationColor: COLORS.emerald500 }}>
            지지
          </span>,{' '}
          <span style={{ textDecoration: 'underline', textDecorationColor: '#fb7185'}}>
            저항
          </span>{' '}
          중 어떤걸 받고 있는 상태인가요?
        </h1>

        {/* 문제 이미지 */}
        <div
          style={{
            marginBottom: 32,
          }}
        >
          <Image
            src="/quiz-q1-v1.png" // public/quiz-q1.png
            alt="지지/저항 문제 이미지"
            width={300}
            height={300}
            style={{
              objectFit: 'contain', // 원본의 사진 비율을 유지한 채 지정 크기로 변환, 즉 비율이 안 맞으면 여백이 생길 수 있음.
            }}
          />
        </div>

        {/* 답변 버튼 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',   //세로 줄 정렬
            justifyContent: 'center',  //가로 줄 정렬
            gap: 24,
          }}
        >
          <Button
            onClick={() => handleAnswer('지지')}  //저거 걍 handle파트만 하면 생각해보면 그 인자값을 넘겨서 실행하라는 뜻이여서 시작과 동시에 실행값이 담기게 되는거임. 근데 우리는 함수를 넘겨야 해서 저렇게 해야함.
            disabled={answered}
            style={{
              borderRadius: 16, 
              paddingLeft: 32,
              paddingRight: 32,
              backgroundColor: answered ? 'rgba(4,120,87,0.6)' : COLORS.emerald700,
              color: '#ffffff',
              opacity: answered ? 0.6 : 1,  //opacity는 투명도 1:불투명, 0:완전 투명
            }}
          >
            지지
          </Button>

          <Button
            onClick={() => handleAnswer('저항')}
            disabled={answered}
            style={{
              borderRadius: 16,
              paddingLeft: 32,
              paddingRight: 32,
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: COLORS.emerald700,
              color: COLORS.emerald700,
              opacity: answered ? 0.6 : 1,
            }}
          >
            저항
          </Button>
        </div>

        {/* 피드백 + CTA */}
        {answered && (    //조건부 랜더링, 저게 참이여야 괄호 안 내용을 랜더링함
          <div
            style={{
              marginTop: 24, // mt-6
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontWeight: 600,
                color: isCorrect ? COLORS.emerald700 : COLORS.rose600,
              }}
            >
              {isCorrect ? "정답입니다! 🙌" : "아쉬워요! 다음엔 더 잘할 수 있어요."}
            </p>

            {/* (선택) 더 많은 퀴즈로 이동 — /promo 라우트 */}
            <div style={{ marginTop: 16 }}>
              <Link href="/">
                <Button
                  style={{
                    borderRadius: 16,
                    backgroundColor: COLORS.emerald600,
                    color: '#ffffff',
                  }}
                >
                  더 많은 퀴즈 보러가기 →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
