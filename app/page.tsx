'use client'

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from 'next/link'
import { Check, LineChart, Sparkles, Trophy, Flame, Star, BarChart3, BookOpenText, ShieldCheck, PlayCircle, ArrowRight, ChevronRight, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const DemoQuiz = ({ onComplete }: { onComplete?: () => void }) => { //?때문에 onComplete라는 이름을 갖는 객체의 속성값이 있어도 없어도 상관 없고, 인자를 갖지 않는 반환이 없는 함수
    //이해 중요 function greet(data)이렇게 쓰면 greet({ name: "철수", age: 30 }); 이렇게 실행하면 저 놈은 객체가 됨. 즉 data.name, data.age 이런식으로 쓰기 가능
    //근데 숫자로 넣으면 즉 greet(10) 그건 걍 변수, 중요한게 {}이건 객체 표시가 맞는데, 위의 name,age는 그 객체의 속성값들인거 주의하자.
    //function greet({ name, age }) 이렇게 하게 되면 greet({ name: "철수", age: 30 }); 이렇게 호출해서 name, age로 쓸 수 있고, 더불어 그 이름으로만 값을 줘야함.
  const questions = useMemo(   //저렇게 useMomo쓰면 반복되는 것을 계속 실행하지 않고, 한번 실행 후 저장했다가 그 값만 불러옴 
    () => [                    //배열임을 알 수 있음
      {
        id: 1,
        type: "choice" as const,
        stem: "다음 중 분산투자의 핵심 효과를 가장 잘 설명한 것은?",
        options: [
          "수익률의 평균을 올리고 손실 가능성을 동시에 높인다",
          "개별 종목 위험을 줄여 포트폴리오 변동성을 낮춘다",
          "시장위험(체계적 위험)을 완전히 제거한다",
          "거래 빈도를 높여 기대수익을 향상한다",
        ],
        answer: 1,
      },
      {
        id: 2,
        type: "order" as const,
        stem: "가격지수 구성 방식을 난이도 순으로 배열하시오 (쉬움→어려움)",
        options: ["가격가중", "동일가중", "시가총액가중"],
        answerOrder: ["가격가중", "동일가중", "시가총액가중"],
      },
      {
        id: 3,
        type: "flash" as const,  //flash는 단답형
        stem: "괴리율 정의를 한국어로 간단히 적으시오",
        placeholder: "힌트: 두 대상의 차이와 관련이 있다.",
        keyword: ["순자산가치", "시장가격", "차이"], // 이게 모두 들어가면 정답처리해주기
      },
    ],
    [] //이 안의 값이 바뀔때만 재실행 하는데 여기는 바뀔것이 아무것도 없네. 즉 한번 만들면 다시 만들생각하지 말고, 가져다 쓰라는 뜻
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [order, setOrder] = useState<string[]>([]); //문자열 배열["","",""]
  const [score, setScore] = useState(0);
  const q = questions[index];

  const handleNext = () => {
    if (q.type === "choice" && selected !== null) {
      if (selected === q.answer) setScore((s) => s + 1);
    }
    if (q.type === "flash") {
      const ok = (q as any).keyword.every((k: string) => typed.includes(k)); //q as any: q를 아무타입으로 만들어서 keyword없어도 안걸리게
      if (ok) setScore((s) => s + 1);   //.every()모든게 참이면 true, 아니면 false 리턴, k에 keyword들이 하나씩 받아짐
    }                                   //.includes() 그걸 포함하면 참, 아니면 거짓 반환
    if (q.type === "order") {
      const correct = JSON.stringify(order) === JSON.stringify((q as any).answerOrder);
      if (correct) setScore((s) => s + 1);  //이놈이 배열이여서 메모리 주소를 비교하니까 무조건 달라서 false가 나와버림. 그래서 JSON.stringify를 써서
    }  // 문자열로 바꿔 버려서 그걸 방지하려는 거임.
    const next = index + 1;
    if (next < questions.length) {
      setIndex(next);
      setSelected(null);
      setTyped("");
      setOrder([]);
    } else {
      onComplete?.();
    }
  };
  const pct = (index / questions.length) * 100;

 return (
  <div
    style={{
      width: '100%',
      maxWidth: 576,                
      margin: '0 auto',             
    }}
  >
    <div
      style={{
        marginBottom: 12,           
        display: 'flex',
        alignItems: 'center',
        gap: 8,                     
      }}
    >
      <Badge style={{ borderRadius: 9999 }}> {/*배지 단 것 처럼 표시됨*/}
        <Flame style={{ height: 14, width: 14, marginRight: 4 }} /> {/*단순한 불꽃 모양*/}
        체인 3일차
      </Badge>
      <Badge style={{ backgroundColor: '#10b981', color: '#ffffff' }}>
        입문 퀘스트
      </Badge>
    </div>

    <Progress value={pct} style={{ height: 8 }} /> {/*진행도가 채워지는 막대임*/}

    <Card style={{ marginTop: 12 }}> {/* 카드 생성 */}
      <CardHeader>
        <CardTitle style={{ fontSize: 18}}>{q.stem}</CardTitle>
      </CardHeader>

      <CardContent style={{ display: 'grid', rowGap: 12}}>
        {q.type === 'choice' && (
          <div style={{ display: 'grid', gap: 8 }}>
            {(q as any).options.map((op: string, i: number) => { //map()은 option의 배열 값을 하나씩 꺼내는 반복문임
              const active = selected === i
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',                   
                    borderRadius: 16,                         
                    border: `1px solid ${
                      active ? '#10b981' : '#e5e7eb'
                    }`,
                    backgroundColor: active ? '#ecfdf5' : '#ffffff',
                    transition: 'background-color .4s ease, border-color .4s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        height: 20, width: 20, borderRadius: 9999,
                        border: `1px solid ${active ? '#10b981' : '#cbd5e1'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {active && (
                        <Check style={{ height: 12, width: 12, color: '#059669'}} />  //check 표시
                      )}
                    </div>
                    <span>{op}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {q.type === 'flash' && (
          <div style={{ display: 'grid', rowGap: 8}}>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)} //e는 이벤트 객체로 어떤 이벤트가 발생하면 자동으로 받음. 이때 e.target은 이벤트의 타겟이니 input이 되고
              placeholder={(q as any).placeholder}       //value는 클라이언트가 입력한 값이 된다.
              style={{
                width: '100%',                 
                padding: '12px 16px',          
                borderRadius: 16,              
                border: '1px solid #e5e7eb',   
                outline: 'none',             
              }}
            />
            <p style={{ fontSize: 12, color: '#64748b'}}>
              키워드:{' '}
              {(q as any).keyword.map((k: string, i: number) => (
                <Badge key={i} variant="outline" style={{ marginRight: 4}}>
                  {k}
                </Badge>
              ))}
            </p>
          </div>
        )}

        {q.type === 'order' && (<div style={{ display: 'grid', rowGap: 8 }}>
            <p style={{ fontSize: 14, color: '#475569' }}>
            카드를 클릭하여 순서대로 정렬하세요.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {((q as any).options as string[]).map((op: string, idx: number) => {
                const pickedIndex = order.findIndex((x) => x === op);  //조건에 맞는 놈이 몇번째에 있는지 숫자로 알려줌, 없으면 -1 할당
                const picked = pickedIndex > -1; //즉 찾았다라는 의미임
                return (
                <button
                    key={idx}
                    onClick={() =>setOrder((arr) => (arr.includes(op) ? arr : [...arr, op]))}
                    disabled={picked}
                    style={{
                    padding: '8px 12px',
                    borderRadius: 12,
                    border: `1px solid ${picked ? '#10b981' : '#e5e7eb'}`,
                    backgroundColor: picked ? '#ecfdf5' : '#ffffff',
                    color: picked ? '#065f46' : '#0f172a',
                    cursor: picked ? 'default' : 'pointer',
                    opacity: picked ? 0.9 : 1,
                    }}>
                    {picked ? `${pickedIndex + 1}. ` : ''}
                    {op}
                </button>
                );
            })}
            </div>
            {order.length > 0 && (
                <div style={{ fontSize: 12, color: '#64748b' }}>
                    현재 순서: {order.join(' → ')} {/*()안에 넣어준 문자열로 싹 다 이어 붙여서, 하나의 긴 문자열로 만들어 줌*/}
                </div>
            )}
            </div>
            )}

            <div
              style={{
                paddingTop: 8,                        
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <div style={{ fontSize: 14, color: '#64748b'}}>
                점수: {score} / {questions.length}
              </div>
              <Button onClick={handleNext} style={{ borderRadius: 16}}>
                {index === questions.length - 1 ? '완료  >' : '다음 >'}{' '}
              </Button>
            </div>
      </CardContent>
    </Card>

    <div style={{ marginTop: 12, fontSize: 12, color: '#64748b'}}>
      * 체험용 퀴즈입니다. 실제 앱에서는 난이도 적응·해설 카드·차트 퍼즐이 포함됩니다.
    </div>
  </div>
)
}
// Feature 컴포넌트 인라인 스타일
const Feature = ({ icon: Icon, title, desc }: any) => (
  <Card style={{ height: '100%' }}>
    <CardHeader style={{ paddingBottom: 8}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ padding: 8, borderRadius: 12, backgroundColor: '#ecfdf5'}}>
          <Icon style={{ height: 20, width: 20, color: '#059669'}} />
        </div>
        <CardTitle style={{ fontSize: 16}}>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7}}>
        {desc}
      </p>
    </CardContent>
  </Card>
);

// ==== 아래는 페이지 전체 레이아웃 부분 인라인 스타일 버전 ====

export default function StockLingoPromo() {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

return (
  <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
    {/* 헤더 */}
    <header
      style={{
        position: 'sticky',  //아래로 스크롤해도 안 위에서 안 사라짐
        top: 0,
        zIndex: 30,  //이게 파워포인트 앞으로 보내기 느낌, 스크롤 해도 남아 있으니까 내릴 때 다른 컴포넌트에 의해 가려지지 않기 위해
        backdropFilter: 'blur(8px)',
        background: 'rgba(255,255,255,0.7)',
        borderBottom: '1px solid #e2e8f0',
        width: '100vw',
      }}
    >
      <div
        style={{
          maxWidth: 1152, // ~ 6xl
          width: '100vw',
          margin: '0 auto',
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 12,
          paddingBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              height: 32,
              width: 32,
              borderRadius: 12,
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent:'center',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontWeight: 600 }}>StockLingo</div>
          <Badge variant="secondary" style={{ marginLeft: 8 }}>
            알파
          </Badge>
        </div>

        <nav  //네비게이션 표시, 즉 어디로 움직일지 쉽게 해주는 곳임.
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            fontSize: 14,
            color: '#475569',
          }}
        >
          <a href="#features">{/*features를 id로 쓰는 섹션으로 이동함, #은 이 페이지 안에서 찾으라는 뜻임.*/}
            특징
          </a>
          <a href="#demo">
            데모
          </a>
          <a href="#pricing">
            요금
          </a>
          <a href="#faq">
            FAQ
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/account">
            <Button variant="ghost" style={{ borderRadius: 16 }}>
              로그인
            </Button>
          </Link>
          <Link href="/learn">
            <Button style={{ borderRadius: 16 }} onClick={() => setOpen(true)}>
              <PlayCircle style={{ marginRight: 4, height: 16, width: 16 }} />
              체험하기
            </Button>
          </Link>
        </div>
      </div>
    </header>

    {/* 히어로 */}
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          maxWidth: 1152,
          margin: '0 auto',
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 64,
          paddingBottom: 64,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr', //2열을 만들되 차지 비율을 1:1로 하라, fr이 fraction 즉 비율임
          gap: 32,
          alignItems: 'center',
        }}
      >
        <div>
          <Badge style={{ backgroundColor: '#10b981', color: '#fff' }}>주식 공부판 듀오링고</Badge>
          <h1
            style={{
              marginTop: 12,
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            하루 10분, <span style={{ color: '#059669' }}>퀘스트처럼</span> 배우는 투자 문해력
          </h1>
          <p style={{ marginTop: 16, color: '#475569', lineHeight: 1.7 }}>
            스낵 사이즈 레슨·용어 카드·차트 퍼즐·실전 퀴즈로 쌓는 실전형 금융 리터러시. 연속
            학습(🔥체인), 레벨·뱃지, 스터디 리그로 재미와 습관을 동시에 잡습니다.
          </p>

          <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button style={{ borderRadius: 16, padding: '12px 16px' }} onClick={() => setOpen(true)}>
              지금 데모 시작 <ArrowRight style={{ marginLeft: 8, height: 16, width: 16 }} />
            </Button>
            <Button variant="outline" style={{ borderRadius: 16, padding: '12px 16px', borderColor: '#cbd5e1' }}>
              커리큘럼 보기
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
              <Flame style={{ height: 16, width: 16 }} /> 오늘 학습 중 1,284명
            </div>
          </div>
        </div>
        
        {/* 데모 미리보기 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative' }}
        >
          <Card style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', borderRadius: 24, border: '1px solid #e2e8f0' }}>
            <CardHeader style={{ paddingBottom: 8 }}>
              <CardTitle style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <LineChart style={{ height: 20, width: 20, color: '#059669' }} /> 오늘의 미션
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="quiz">  {/*탭 만들기*/}
                <TabsList   // 탭 버튼 목록
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    width: '100%',
                    borderRadius: 16,
                  }}
                >
                  <TabsTrigger value="quiz">퀴즈</TabsTrigger>
                  <TabsTrigger value="cards">용어 카드</TabsTrigger>
                  <TabsTrigger value="puzzle">차트 퍼즐</TabsTrigger>
                </TabsList>

                <TabsContent value="quiz" style={{ marginTop: 16 }}>  {/*각 탭에 대한 내용물*/}
                  <div style={{ display: 'grid', rowGap: 12 }}>
                    <div style={{ fontSize: 14, color: '#475569' }}>ETF 추적오차가 커지는 주요 원인 2가지를 고르시오.</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {['유동성 부족', '편입종목 수 과다', '마켓메이커 비활성', '상장폐지 임박'].map((s, i) => (
                        <button
                          key={i}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                            textAlign: 'left',
                            background: '#fff',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
                      <Clock style={{ height: 16, width: 16 }} /> 제한시간 45초
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cards" style={{ marginTop: 16 }}>
                  <div style={{ display: 'grid', rowGap: 12 }}>
                    {['베타(β)', '알파(α)', '샤프지수'].map((t, i) => (
                      <div
                        key={i}
                        style={{
                          padding: 12,
                          borderRadius: 16,
                          backgroundColor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{t}</div>
                          <div style={{ fontSize: 12, color: '#475569' }}>한 줄 정의와 예시 보기</div>
                        </div>
                        <Badge variant="outline">30초</Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="puzzle" style={{ marginTop: 16 }}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 16,
                      backgroundImage: 'linear-gradient(135deg, #ecfdf5, #eef2ff)',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 500 }}>봉차트에서 ‘가짜 돌파’ 케이스 찾기</div>
                    <div
                      style={{
                        marginTop: 8,
                        height: 128,
                        borderRadius: 12,
                        backgroundColor: '#fff',
                        border: '1px dashed #cbd5e1',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#94a3b8',
                      }}
                    >
                      미니 차트 퍼즐
                    </div>
                    <p style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>손가락으로 범위를 드래그하여 표시하세요.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>

    {/* 특징 */}
    <section id="features" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', paddingLeft: 16, paddingRight: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>핵심 특징</h2>
          <Badge variant="outline" style={{ borderRadius: 9999 }}>
            <Trophy style={{ height: 14, width: 14, marginRight: 4 }} />
            뱃지·체인·리그
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <Feature icon={Sparkles} title="스낵형 레슨" desc="하루 10분, 3~5개의 초단위 과제로 핵심만 흡수. 빈칸·OX·차트 퍼즐·카드매칭." />
          <Feature icon={BarChart3} title="차트 퍼즐 엔진" desc="봉·선·히트맵 미니차트 상호작용으로 패턴/리스크 감각을 훈련." />
          <Feature icon={BookOpenText} title="용어 카드 + 예시" desc="용어 정의를 문장/그림·숫자 예시로 연결해 ‘이해→적용’으로 전환." />
          <Feature icon={ShieldCheck} title="리스크 먼저" desc="과잉확신·도박편향을 낮추는 ‘리스크 우선’ 커리큘럼." />
          <Feature icon={Users} title="스쿼드 스터디" desc="친구와 팀을 이뤄 데일리 미션을 공유하고 서로 힌트 제공." />
          <Feature icon={Star} title="개인화 경로" desc="사전 진단으로 초보·퀀트 입문·파생개론 등 경로 추천." />
        </div>
      </div>
    </section>

    {/* 라이브 데모 섹션 */}
    <section id="demo" style={{ paddingTop: 64, paddingBottom: 64, backgroundColor: '#ffffff' }}>
      <div
        style={{
          maxWidth: 1152,
          margin: '0 auto',
          paddingLeft: 16,
          paddingRight: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          alignItems: 'center',
        }}
      >
        <div>
          <h3 style={{ fontSize: 24, fontWeight: 700 }}>라이브 데모</h3>
          <p style={{ marginTop: 12, color: '#475569', lineHeight: 1.7 }}>
            아래 버튼을 눌러 2분 체험 퀴즈를 시작하세요. 완료 시 체험용 뱃지를 드립니다.
          </p>

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Dialog open={open} onOpenChange={setOpen}>   {/*팝업 창을 만듦, open이 true일 때만 열림*/}
                {/*이거 누르면 팝업 창 열림*/}
              <DialogTrigger asChild>
                <Button style={{ padding: '12px 16px', borderRadius: 16 }}>
                  <PlayCircle style={{ marginRight: 4, height: 16, width: 16 }} /> 2분 체험 시작
                </Button>
              </DialogTrigger>
              <DialogContent style={{ borderRadius: 24, maxWidth: 672 }}>  {/*팝업 창 열리면 보여줄 내용*/}
                <DialogHeader>
                  <DialogTitle>입문 퀴즈 체험</DialogTitle>
                </DialogHeader>
                <DemoQuiz onComplete={() => { setCompleted(true) }} /> {/*위에서 만든 DemoQuiz 함수 호출, 더불어 위에서 설정한 onComplete 객체 함수에게 setCompleted를 true값으로 바꾸게 하는 함수를 전달해줌*/}
              </DialogContent>
            </Dialog>
            <Button
              style={{ padding: '12px 16px', borderRadius: 16 }}
              onClick={() => setOpen(true)}
              variant="outline"
            >
              바로 풀어보기
            </Button>
          </div>

          {completed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16 }}>
              <Badge style={{ backgroundColor: '#f59e0b', color: '#fff' }}>체험 뱃지 획득!</Badge>
            </motion.div>
          )}
        </div>

        <div>
          <Card style={{ borderRadius: 24, border: '1px solid #e2e8f0' }}>
            <CardHeader>
              <CardTitle style={{ fontSize: 16 }}>진척도 & 리그</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', rowGap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>오늘 목표</span>
                  <span style={{ color: '#64748b' }}>8/10 XP</span>
                </div>
                <Progress value={80} style={{ height: 8 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Badge style={{ backgroundColor: '#10b981', color: '#fff' }}>체인 3</Badge>
                <Badge variant="secondary">브론즈 리그 12위</Badge>
                <Badge variant="outline">주간 목표 60%</Badge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {['용어', '차트', '퀴즈'].map((t, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 16, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>오늘</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{[6, 3, 4][i]}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{t}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    {/* 요금/CTA */}
    <section id="pricing" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', paddingLeft: 16, paddingRight: 16 }}>
        <h3 style={{ fontSize: 24, fontWeight: 700 }}>초기 베타 참가</h3>
        <p style={{ marginTop: 8, color: '#475569' }}>
          초기에는 무료 + 얼리버드 혜택(프리미엄 3개월). 학교/동아리/스터디 그룹 대상 단체코드 제공.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 24 }}>
          <Card style={{ borderRadius: 24, border: '1px solid #e2e8f0' }}>
            <CardHeader>
              <CardTitle style={{ fontSize: 16 }}>Free</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', rowGap: 8 }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>₩0</div>
              <ul style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, paddingLeft: 16 }}>
                <li>• 일일 퀘스트 1세트</li>
                <li>• 기본 용어 카드 50개</li>
                <li>• 기초 퀴즈 트랙</li>
              </ul>
              <Button style={{ width: '100%', borderRadius: 16, marginTop: 12 }}>시작하기</Button>
            </CardContent>
          </Card>

          <Card style={{ borderRadius: 24, border: '1px solid #a7f3d0' }}>
            <CardHeader>
              <Badge style={{ backgroundColor: '#10b981', color: '#fff', width: 'fit-content' }}>추천</Badge>
              <CardTitle style={{ fontSize: 16 }}>Pro</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', rowGap: 8 }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>
                ₩7,900<span style={{ fontSize: 16, fontWeight: 500, color: '#64748b' }}>/월</span>
              </div>
              <ul style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, paddingLeft: 16 }}>
                <li>• 무제한 퀘스트 · 해설</li>
                <li>• 차트 퍼즐 엔진 · 실전 세트</li>
                <li>• 스쿼드 리그 & 뱃지</li>
              </ul>
              <Button style={{ width: '100%', borderRadius: 16, marginTop: 12, backgroundColor: '#059669', color: '#fff' }}>
                얼리버드 등록
              </Button>
            </CardContent>
          </Card>

          <Card style={{ borderRadius: 24, border: '1px solid #e2e8f0' }}>
            <CardHeader>
              <CardTitle style={{ fontSize: 16 }}>Edu / Squad</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', rowGap: 8 }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>맞춤</div>
              <ul style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, paddingLeft: 16 }}>
                <li>• 학교/동아리 라이선스</li>
                <li>• 전용 리그 & 대시보드</li>
                <li>• 단체코드 · 코치 툴</li>
              </ul>
              <Button variant="outline" style={{ width: '100%', borderRadius: 16, marginTop: 12 }}>
                문의하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" style={{ paddingTop: 64, paddingBottom: 64, backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', paddingLeft: 16, paddingRight: 16 }}>
        <h3 style={{ fontSize: 24, fontWeight: 700 }}>FAQ</h3>

        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { q: '실제 투자 자문을 제공하나요?', a: '아니요. 교육 서비스로, 투자 판단과 책임은 학습자에게 있습니다. 리스크 문해력 향상이 목표입니다.' },
            { q: '얼마나 해야 효과가 있나요?', a: '하루 10분, 주 5일 4주면 핵심 용어와 리스크 감각이 생깁니다. 체인 기능으로 습관을 붙입니다.' },
            { q: '퀀트/파생 같은 심화도 있나요?', a: '있습니다. 선형대수·확률 기초 브릿지와 함께 쉬운 문제부터 단계적으로 제공합니다.' },
            { q: '데이터 출처는 어떻게 되나요?', a: '실습형 콘텐츠는 공개 데이터·모의 데이터 기반이며, 실시간 시세는 사용하지 않습니다.' },
          ].map((it, i) => (
            <Card key={i} style={{ borderRadius: 16 }}>
              <CardHeader style={{ paddingBottom: 8 }}>
                <CardTitle style={{ fontSize: 16 }}>Q. {it.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7 }}>{it.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* 푸터 */}
    <footer style={{ paddingTop: 40, paddingBottom: 40, borderTop: '1px solid #e2e8f0' }}>
      <div
        style={{
          maxWidth: 1152,
          margin: '0 auto',
          paddingLeft: 16,
          paddingRight: 16,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#475569' }}>
          <div
            style={{
              height: 32,
              width: 32,
              borderRadius: 12,
              backgroundColor: '#10b981',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            S
          </div>
          <span>© {new Date().getFullYear()} StockLingo. 모든 권리 보유.</span>
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>* 본 서비스는 교육 목적이며, 투자 권유가 아닙니다.</div>
      </div>
    </footer>
  </div>
);

}
