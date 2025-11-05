'use client'

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, LineChart, Sparkles, Trophy, Flame, Star, BarChart3, BookOpenText, ShieldCheck, PlayCircle, ArrowRight, ChevronRight, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/* ───────────────── DemoQuiz ───────────────── */
const DemoQuiz = ({ onComplete }: { onComplete?: () => void }) => {
  const questions = useMemo(
    () => [
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
        type: "flash" as const,
        stem: "괴리율 정의를 한국어로 간단히 적으시오",
        placeholder: "힌트: 두 대상의 차이와 관련이 있다.",
        keyword: ["순자산가치", "시장가격", "차이"],
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [order, setOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const q = questions[index];

  const handleNext = () => {
    if (q.type === "choice" && selected !== null) {
      if (selected === q.answer) setScore((s) => s + 1);
    }
    if (q.type === "flash") {
      const ok = (q as any).keyword.every((k: string) => typed.includes(k));
      if (ok) setScore((s) => s + 1);
    }
    if (q.type === "order") {
      const correct = JSON.stringify(order) === JSON.stringify((q as any).answerOrder);
      if (correct) setScore((s) => s + 1);
    }
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
    <div style={{ width: '100%', maxWidth: 576, margin: '0 auto' }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Badge style={{ borderRadius: 9999 }}>
          <Flame style={{ height: 14, width: 14, marginRight: 4 }} />
          체인 3일차
        </Badge>
        <Badge style={{ backgroundColor: '#10b981', color: '#ffffff' }}>
          입문 퀘스트
        </Badge>
      </div>

      <Progress value={pct} style={{ height: 8 }} />

      <Card style={{ marginTop: 12 }}>
        <CardHeader>
          <CardTitle style={{ fontSize: 18 }}>{q.stem}</CardTitle>
        </CardHeader>

        <CardContent style={{ display: 'grid', rowGap: 12 }}>
          {q.type === 'choice' && (
            <div style={{ display: 'grid', gap: 8 }}>
              {(q as any).options.map((op: string, i: number) => {
                const active = selected === i
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      borderRadius: 16,
                      border: `1px solid ${active ? '#10b981' : '#e5e7eb'}`,
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
                          <Check style={{ height: 12, width: 12, color: '#059669' }} />
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
            <div style={{ display: 'grid', rowGap: 8 }}>
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={(q as any).placeholder}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 16,
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                }}
              />
              <p style={{ fontSize: 12, color: '#64748b' }}>
                키워드:{' '}
                {(q as any).keyword.map((k: string, i: number) => (
                  <Badge key={i} variant="outline" style={{ marginRight: 4 }}>
                    {k}
                  </Badge>
                ))}
              </p>
            </div>
          )}

          {q.type === 'order' && (
            <div style={{ display: 'grid', rowGap: 8 }}>
              <p style={{ fontSize: 14, color: '#475569' }}>
                카드를 클릭하여 순서대로 정렬하세요.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {((q as any).options as string[]).map((op: string, idx: number) => {
                  const pickedIndex = order.findIndex((x) => x === op);
                  const picked = pickedIndex > -1;
                  return (
                    <button
                      key={idx}
                      onClick={() => setOrder((arr) => (arr.includes(op) ? arr : [...arr, op]))}
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
                  현재 순서: {order.join(' → ')}
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
            <div style={{ fontSize: 14, color: '#64748b' }}>
              점수: {score} / {questions.length}
            </div>
            <Button onClick={handleNext} style={{ borderRadius: 16 }}>
              {index === questions.length - 1 ? '완료  >' : '다음 >'}{' '}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>
        * 체험용 퀴즈입니다. 실제 앱에서는 난이도 적응·해설 카드·차트 퍼즐이 포함됩니다.
      </div>
    </div>
  )
}

/* ───────────────── 작은 카드 Feature ───────────────── */
const Feature = ({ icon: Icon, title, desc }: any) => (
  <Card style={{ height: '100%' }}>
    <CardHeader style={{ paddingBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ padding: 8, borderRadius: 12, backgroundColor: '#ecfdf5' }}>
          <Icon style={{ height: 20, width: 20, color: '#059669' }} />
        </div>
        <CardTitle style={{ fontSize: 16 }}>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
        {desc}
      </p>
    </CardContent>
  </Card>
);

/* ───────────────── 메인 페이지 ───────────────── */
export default function StockLingoPromo() {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#f8fafc' }}>
      {/* 헤더 */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backdropFilter: 'blur(8px)',
          background: 'rgba(255,255,255,0.7)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div className="sl-container sl-header-row" style={{ paddingTop: 12, paddingBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                height: 32,
                width: 32,
                borderRadius: 12,
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                flex: '0 0 auto',
              }}
            >
              S
            </div>
            <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>StockLingo</div>
            <Badge variant="secondary" style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>
              알파
            </Badge>
          </div>

          <nav className="sl-nav" style={{ flex: '1 1 320px', minWidth: 240, justifyContent: 'center' }}>
            <a href="#features">특징</a>
            <a href="#demo">데모</a>
            <a href="#pricing">요금</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="sl-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
            <Button variant="ghost" style={{ borderRadius: 16, whiteSpace: 'nowrap' }}>
              로그인
            </Button>
            <Button style={{ borderRadius: 16, whiteSpace: 'nowrap' }} onClick={() => setOpen(true)}>
              <PlayCircle style={{ marginRight: 4, height: 16, width: 16 }} />
              체험하기
            </Button>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="sl-container sl-grid-2 sl-section">
          <div>
            <Badge style={{ backgroundColor: '#10b981', color: '#fff' }}>주식 공부판 듀오링고</Badge>
            <h1 className="sl-hero-title"
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
                <Tabs defaultValue="quiz">
                  <TabsList
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

                  <TabsContent value="quiz" style={{ marginTop: 16 }}>
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
      <section id="features" className="sl-section">
        <div className="sl-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 24,
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>핵심 특징</h2>
            <Badge variant="outline" style={{ borderRadius: 9999 }}>
              <Trophy style={{ height: 14, width: 14, marginRight: 4 }} />
              뱃지·체인·리그
            </Badge>
          </div>

          <div className="sl-grid-3">
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
      <section id="demo" className="sl-section" style={{ backgroundColor: '#ffffff' }}>
        <div className="sl-container sl-grid-2">
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 700 }}>라이브 데모</h3>
            <p style={{ marginTop: 12, color: '#475569', lineHeight: 1.7 }}>
              아래 버튼을 눌러 2분 체험 퀴즈를 시작하세요. 완료 시 체험용 뱃지를 드립니다.
            </p>

            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button style={{ padding: '12px 16px', borderRadius: 16 }}>
                    <PlayCircle style={{ marginRight: 4, height: 16, width: 16 }} /> 2분 체험 시작
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ borderRadius: 24, maxWidth: 672 }}>
                  <DialogHeader>
                    <DialogTitle>입문 퀴즈 체험</DialogTitle>
                  </DialogHeader>
                  <DemoQuiz onComplete={() => { setCompleted(true) }} />
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <Badge style={{ backgroundColor: '#10b981', color: '#fff' }}>체인 3</Badge>
                  <Badge variant="secondary">브론즈 리그 12위</Badge>
                  <Badge variant="outline">주간 목표 60%</Badge>
                </div>

                <div className="sl-cards-3">
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
      <section id="pricing" className="sl-section">
        <div className="sl-container">
          <h3 style={{ fontSize: 24, fontWeight: 700 }}>초기 베타 참가</h3>
          <p style={{ marginTop: 8, color: '#475569' }}>
            초기에는 무료 + 얼리버드 혜택(프리미엄 3개월). 학교/동아리/스터디 그룹 대상 단체코드 제공.
          </p>

          <div className="sl-grid-3" style={{ marginTop: 24 }}>
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
      <section id="faq" className="sl-section" style={{ backgroundColor: '#ffffff' }}>
        <div className="sl-container">
          <h3 style={{ fontSize: 24, fontWeight: 700 }}>FAQ</h3>

          <div className="sl-grid-2-loose" style={{ marginTop: 24 }}>
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
        <div className="sl-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
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

      {/* ───────── 공용 반응형 유틸 ───────── */}
      <style jsx global>{`
        .sl-container {
          max-width: 1152px;
          margin: 0 auto;
          padding-left: 16px;
          padding-right: 16px;
          width: 100%;
        }
        .sl-section {
          padding-top: 64px;
          padding-bottom: 64px;
        }

        .sl-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: center;
        }
        .sl-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .sl-grid-2-loose {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          align-items: start;
        }
        .sl-cards-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .sl-nav {
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 14px;
          color: #475569;
          flex-wrap: wrap;
        }

        /* Breakpoints */
        @media (max-width: 1024px) {
          .sl-grid-3 { grid-template-columns: repeat(2, 1fr); }
          .sl-cards-3 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .sl-grid-2,
          .sl-grid-2-loose { grid-template-columns: 1fr; gap: 20px; }
          .sl-grid-3 { grid-template-columns: 1fr; }
          .sl-cards-3 { grid-template-columns: 1fr; }
          .sl-hero-title { font-size: 28px !important; }

          .sl-header-row {
            flex-direction: column;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .sl-header-actions {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
