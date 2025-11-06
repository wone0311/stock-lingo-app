'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Lock, Check, X, ArrowLeft, Sparkles, Flame, Stars, Crown, Star, Headphones, Repeat2, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

type Question = {
  id: string
  type: 'multiple' | 'truefalse' | 'fill'
  question: string
  options?: string[]
  answer: number | boolean | string
  explanation?: string
}

type Stage = {
  id: number
  title: string
  emoji?: string
  description: string
  questions: Question[]
  icon?: 'candle' | 'star' | 'headphone' | 'repeat' | 'chest'
}

// ------------------------------------------------------------
// Dummy curriculum
// ------------------------------------------------------------

const CURRICULUM: Stage[] = [
  {
    id: 1,
    title: '지지선 · 저항선',
    description: '가격이 멈추거나 반전되기 쉬운 구간을 익혀요',
    icon: 'candle',
    questions: [
      { id: '1-1', type: 'multiple', question: '지지선의 일반적 의미는 무엇인가요?', options: ['가격 상승 촉진 구간', '가격 하락이 멈추기 쉬운 구간', '거래 정지 구간', '배당 기준일'], answer: 1, explanation: '지지선은 매수 대기 물량이 많아 하락이 멈추거나 반등이 나오는 가격대입니다.' },
      { id: '1-2', type: 'truefalse', question: '저항선 돌파 후에는 해당 가격대가 지지선으로 작용할 수 있다.', answer: true, explanation: '돌파선의 재테스트가 지지로 작동하는 경우가 많습니다.' },
      { id: '1-3', type: 'fill', question: '봉차트에서 고점들을 이은 선이 대체로 (    ) 역할을 한다.', answer: '저항선', explanation: '여러 고점을 이으면 공급 압력이 나타난 구간으로 저항선이 됩니다.' }
    ]
  },
  {
    id: 2,
    title: '이동평균선 (MA)',
    description: '단기·중기·장기 흐름을 분해해서 보아요',
    icon: 'candle',
    questions: [
      { id: '2-1', type: 'multiple', question: '일반적으로 단기 추세를 가장 잘 반영하는 것은?', options: ['5일선', '60일선', '120일선', '연중 최고가'], answer: 0, explanation: '5일선은 매우 민감하게 단기 흐름을 반영합니다.' },
      { id: '2-2', type: 'truefalse', question: '골든크로스는 단기선이 장기선을 상향 돌파하는 신호다.', answer: true, explanation: '단기 강세 전환의 전형적 시그널입니다.' },
      { id: '2-3', type: 'fill', question: '이평선 간격이 좁아지는 현상은 (    ) 중이라고도 표현한다.', answer: '수렴', explanation: '수렴은 향후 방향성 확대의 전주가 될 수 있습니다.' }
    ]
  },
  {
    id: 3,
    title: '추세선 · 채널',
    description: '상·하향 추세선과 평행 채널을 그려요',
    icon: 'candle',
    questions: [
      { id: '3-1', type: 'multiple', question: '상승 추세선은 보통 어떤 점들을 연결하나요?', options: ['연속된 고점', '연속된 저점', '시가와 종가', '거래량 피크'], answer: 1, explanation: '상승 추세선은 상승 과정의 저점들을 이은 선입니다.' },
      { id: '3-2', type: 'truefalse', question: '채널 상단을 돌파하면 항상 매수다.', answer: false, explanation: '상황 의존적입니다. 과매수·가짜돌파 가능성도 함께 봐야 합니다.' }
    ]
  }
]

// ------------------------------------------------------------
// Local storage helpers (학습 진행 저장)
// ------------------------------------------------------------

const STORAGE_KEY = 'stocklingo.learn.v2'

type SaveState = { clearedStageIds: number[] }

const loadState = (): SaveState => {
  if (typeof window === 'undefined') return { clearedStageIds: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SaveState) : { clearedStageIds: [] }
  } catch {
    return { clearedStageIds: [] }
  }
}

const saveState = (state: SaveState) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

// ------------------------------------------------------------
// Stock Candlestick Icon (Duolingo node 아이콘 대체)
// ------------------------------------------------------------

const CandleIcon: React.FC<{ locked?: boolean }>=({ locked })=>{
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <rect x="1" y="1" width="26" height="26" rx="6" className={locked? 'fill-muted stroke-muted-foreground/30' : 'fill-primary/10 stroke-primary/30'} strokeWidth="1"/>
      {/* wicks */}
      <rect x="9" y="5" width="2" height="18" className={locked? 'fill-muted-foreground/40' : 'fill-primary'} />
      <rect x="17" y="5" width="2" height="18" className={locked? 'fill-muted-foreground/40' : 'fill-primary'} />
      {/* bodies */}
      <rect x="7" y="10" width="6" height="8" rx="1" className={locked? 'fill-muted-foreground/30' : 'fill-primary'} />
      <rect x="15" y="8" width="6" height="10" rx="1" className={locked? 'fill-muted-foreground/30' : 'fill-green-500'} />
    </svg>
  )
}

const NodeIcon: React.FC<{ name?: Stage['icon']; locked?: boolean }> = ({ name='candle', locked }) => {
  if (name==='star') return <Star className={locked? 'opacity-40' : ''} />
  if (name==='headphone') return <Headphones className={locked? 'opacity-40' : ''} />
  if (name==='repeat') return <Repeat2 className={locked? 'opacity-40' : ''} />
  if (name==='chest') return <Gift className={locked? 'opacity-40' : ''} />
  return <CandleIcon locked={locked} />
}

// ------------------------------------------------------------
// Stage Node (세로 스크롤 경로의 한 점)
// ------------------------------------------------------------

const StageNode: React.FC<{
  stage: Stage
  index: number
  unlocked: boolean
  cleared: boolean
  onEnter: () => void
}> = ({ stage, index, unlocked, cleared, onEnter }) => {
  const side = index % 2 === 0 ? 'left' : 'right' // 좌우 지그재그 배치

  return (
    <div className={`relative snap-start h-[140px] grid place-items-center`}>
      {/* 연결 곡선 (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={side==='left' ? 'M10,100 C10,50 90,50 90,0' : 'M90,100 C90,50 10,50 10,0'} stroke="hsl(var(--border))" strokeWidth="1.5" fill="none" strokeDasharray="4 6" />
      </svg>

      {/* 노드 */}
      <motion.button
        whileHover={unlocked ? { scale: 1.02 } : undefined}
        whileTap={unlocked ? { scale: 0.98 } : undefined}
        onClick={unlocked ? onEnter : undefined}
        className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-2xl border bg-card shadow-sm ${
          side==='left' ? 'translate-x-[-18%]' : 'translate-x-[18%]'
        } ${!unlocked ? 'opacity-60' : ''}`}
      >
        <div className="h-12 w-12 rounded-full grid place-items-center bg-background border">
          <NodeIcon name={stage.icon} locked={!unlocked} />
        </div>
        <div className="text-left">
          <div className="font-semibold text-sm">{stage.title}</div>
          <div className="text-xs text-muted-foreground">{stage.description}</div>
          {cleared && (
            <Badge variant="secondary" className="mt-1 inline-flex items-center gap-1"><Trophy className="h-3.5 w-3.5"/> Cleared</Badge>
          )}
          {!unlocked && (
            <div className="mt-1 text-xs inline-flex items-center gap-1 text-muted-foreground"><Lock className="h-3 w-3"/> 이전 스테이지 클리어 필요</div>
          )}
        </div>
      </motion.button>
    </div>
  )
}

// ------------------------------------------------------------
// Stage Path (Duolingo 스타일 세로 스크롤 지도)
// ------------------------------------------------------------

const StagePath: React.FC<{
  curriculum: Stage[]
  clearedStageIds: number[]
  onEnter: (stage: Stage) => void
}> = ({ curriculum, clearedStageIds, onEnter }) => {
  const listRef = useRef<HTMLDivElement>(null)

  // 처음 들어오면 가장 최근 해금/진행 중 스테이지로 스크롤
  useEffect(() => {
    const lastCleared = Math.max(0, ...clearedStageIds)
    const targetId = lastCleared ? lastCleared + 1 : 1
    const idx = Math.max(0, curriculum.findIndex(s=>s.id===targetId))
    const el = listRef.current?.querySelectorAll('[data-node]')?.[idx] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  return (
    <div
      ref={listRef}
      className="relative h-[calc(100vh-9rem)] overflow-y-auto snap-y snap-mandatory px-2"
    >
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border" />
      <div className="py-6 space-y-6">
        {curriculum.map((s, i) => {
          const cleared = clearedStageIds.includes(s.id)
          const unlocked = s.id === 1 || clearedStageIds.includes(s.id - 1)
          return (
            <div key={s.id} data-node>
              <StageNode
                stage={s}
                index={i}
                unlocked={unlocked}
                cleared={cleared}
                onEnter={() => onEnter(s)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// Quiz Stage (한 스테이지 내부 퀴즈 흐름)
// ------------------------------------------------------------

const QuizStage: React.FC<{ stage: Stage; onClear: () => void }> = ({ stage, onClear }) => {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [checking, setChecking] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const q = stage.questions[idx]
  const progress = Math.round((idx / stage.questions.length) * 100)

  const verify = () => {
    if (!q) return
    setChecking(true)

    let ok = false
    if (q.type === 'multiple') ok = selected === (q.answer as number)
    if (q.type === 'truefalse') ok = (selected === 1) === (q.answer as boolean)
    if (q.type === 'fill') ok = typed.trim() === String(q.answer).trim()

    setIsCorrect(ok)
    setTimeout(() => {
      setChecking(false)
      setIsCorrect(null)
      if (ok) {
        const next = idx + 1
        if (next >= stage.questions.length) {
          onClear()
        } else {
          setIdx(next)
          setSelected(null)
          setTyped('')
        }
      }
    }, 700)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CandleIcon />
          <h2 className="text-xl font-semibold">{stage.title}</h2>
        </div>
        <Progress value={progress} />
        <div className="mt-1 text-xs text-muted-foreground">{progress}% 완료</div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base flex items-start gap-2">
            <span className="mt-1 text-lg">🧠</span>
            <span>{q.question}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {q.type === 'multiple' && (
            <div className="grid gap-2">
              {q.options!.map((opt, i) => (
                <button key={i} onClick={() => setSelected(i)} className={`text-left border rounded-xl px-4 py-3 transition ${selected === i ? 'border-primary ring-2 ring-primary/30' : 'hover:bg-muted'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-5 w-5 grid place-items-center rounded-full border ${selected === i ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>{selected === i && <Check className="h-3.5 w-3.5" />}</div>
                    <span>{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {q.type === 'truefalse' && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant={selected === 1 ? 'default' : 'outline'} onClick={() => setSelected(1)}>맞다</Button>
              <Button variant={selected === 0 ? 'default' : 'outline'} onClick={() => setSelected(0)}>아니다</Button>
            </div>
          )}

          {q.type === 'fill' && (
            <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="정답 입력" className="w-full border rounded-xl px-4 py-3 bg-background" />
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={verify} disabled={q.type !== 'fill' ? selected === null : typed.trim().length === 0}>
              {idx + 1 === stage.questions.length ? '제출하고 클리어' : '제출'}
            </Button>
            <span className="text-xs text-muted-foreground">{idx + 1} / {stage.questions.length}</span>
          </div>

          <AnimatePresence>
            {checking && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="text-sm">
                {isCorrect === null && <span>채점 중...</span>}
                {isCorrect === true && (
                  <div className="flex items-center gap-2 text-green-600"><Sparkles className="h-4 w-4" /> 정답! 잘하고 있어요</div>
                )}
                {isCorrect === false && (
                  <div className="flex items-center gap-2 text-red-600"><X className="h-4 w-4" /> 아쉬워요. {q.explanation ? '힌트를 확인하고 다시 시도해요.' : '다시 시도해요.'}</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!!q.explanation && (
            <div className="text-xs text-muted-foreground border-t pt-3">💡 {q.explanation}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ------------------------------------------------------------
// Clear Dialog (클리어 축하 + 다음 해금)
// ------------------------------------------------------------

const ClearDialog: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; onNext: () => void; hasNext: boolean }>= ({ open, onOpenChange, onNext, hasNext }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" /> Stage Clear!</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-sm">훌륭해요! 다음 단계가 해금되었어요.</div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>나중에</Button>
          <Button onClick={onNext} disabled={!hasNext}>다음 단계로</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ------------------------------------------------------------
// Page ( /learn )
// ------------------------------------------------------------

export default function LearnPage() {
  const [save, setSave] = useState<SaveState>({ clearedStageIds: [] })
  const [current, setCurrent] = useState<Stage | null>(null)
  const [clearOpen, setClearOpen] = useState(false)

  // 초기 로드
  useEffect(() => { setSave(loadState()) }, [])
  useEffect(() => { saveState(save) }, [save])

  const onClear = () => {
    if (!current) return
    setSave((prev) => ({ clearedStageIds: Array.from(new Set([...prev.clearedStageIds, current.id])) }))
    setClearOpen(true)
  }

  const hasNext = useMemo(() => !!current && CURRICULUM.some((s) => s.id === current.id + 1), [current])
  const goNext = () => {
    if (!current) return
    const nextStage = CURRICULUM.find((s) => s.id === current.id + 1) || null
    setCurrent(nextStage)
    setClearOpen(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          {current ? (
            <Button variant="ghost" size="sm" onClick={() => setCurrent(null)} className="-ml-2"> <ArrowLeft className="h-4 w-4" /> </Button>
          ) : (
            <span className="text-xl">🗺️</span>
          )}
          <div className="font-semibold">Learn</div>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <Badge variant="outline" className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> Streak</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><Stars className="h-3.5 w-3.5" /> XP</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><Crown className="h-3.5 w-3.5" /> Rank</Badge>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {!current && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2"> <span>게임형 학습 여정</span> <span className="text-2xl">🎮</span> </h1>
              <p className="text-sm text-muted-foreground mt-1">세로 스크롤로 여정을 따라 내려가며 스테이지를 하나씩 해금하세요.</p>
            </div>
            <StagePath curriculum={CURRICULUM} clearedStageIds={save.clearedStageIds} onEnter={setCurrent} />
          </>
        )}

        {current && (<QuizStage stage={current} onClear={onClear} />)}
      </div>

      {/* Clear dialog */}
      <ClearDialog open={clearOpen} onOpenChange={setClearOpen} onNext={goNext} hasNext={!!hasNext} />
    </div>
  )
}
