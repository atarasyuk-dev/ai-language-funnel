'use client';

import React, { useReducer, useState, useEffect, useRef } from 'react';
import { Briefcase, Mic, FileText, Users, Clock, Zap, Sparkles, ChevronRight, ChevronLeft, Check, TrendingUp, Calendar, Target, AlertCircle, Coffee, BookX, Volume2, Loader2, Lock, Unlock, ArrowRight, Brain } from 'lucide-react';
import type { CareerAnswers } from '../types/career-funnel.types';

// ============================================================
// DESIGN TOKENS — sky (light & bright)
// ============================================================
const colors = {
    cream: '#FFFFFF',
    creamDeep: '#EEF6FC',
    ink: '#0E2236',
    inkSoft: '#2B3F55',
    coral: '#0A93D1',
    coralSoft: '#D4ECFB',
    sage: '#7FA89C',
    sageSoft: '#E8F1ED',
    amber: '#E8A93C',
    border: '#E2EBF2',
    muted: '#7A8898',
};

// ============================================================
// FUNNEL STATE
// ============================================================
type FunnelState = {
    step: number;
    answers: CareerAnswers;
    direction: 'forward' | 'back';
    thinking: boolean;
};

type FunnelAction =
    | { type: 'NEXT' }
    | { type: 'BACK' }
    | { type: 'ANSWER'; key: keyof CareerAnswers; value: string | number }
    | { type: 'THINKING'; value: boolean };

const initialState: FunnelState = {
    step: 0,
    answers: {},
    direction: 'forward',
    thinking: false,
};

function reducer(state: FunnelState, action: FunnelAction): FunnelState {
    switch (action.type) {
        case 'NEXT':
            return { ...state, step: state.step + 1, direction: 'forward', thinking: false };
        case 'BACK':
            return { ...state, step: state.step - 1, direction: 'back', thinking: false };
        case 'ANSWER':
            return { ...state, answers: { ...state.answers, [action.key]: action.value } };
        case 'THINKING':
            return { ...state, thinking: action.value };
        default:
            return state;
    }
}

// ============================================================
// BRANCHING COPY LIBRARY
// ============================================================
const goalLabels: Record<string, string> = {
    meetings: 'speaking up in meetings',
    interviews: 'nailing job interviews',
    emails: 'writing professional emails',
    presentations: 'delivering presentations',
};

const goalShort: Record<string, string> = {
    meetings: 'meetings',
    interviews: 'interviews',
    emails: 'emails',
    presentations: 'presentations',
};

const subContextOptions: Record<string, Array<{ id: string; label: string; sub: string }>> = {
    meetings: [
        { id: 'standups', label: 'Daily standups', sub: 'Quick updates, status checks' },
        { id: 'clientcalls', label: 'Client calls', sub: 'External, high-stakes conversations' },
        { id: 'brainstorms', label: 'Brainstorms & debates', sub: 'Where ideas move fast' },
        { id: 'leadership', label: 'Talking to leadership', sub: '1:1s with senior people' },
    ],
    interviews: [
        { id: 'tech', label: 'Technical interviews', sub: 'Explaining how things work' },
        { id: 'behavioral', label: 'Behavioral rounds', sub: '"Tell me about a time…"' },
        { id: 'screening', label: 'Recruiter screens', sub: 'First 30-min conversations' },
        { id: 'panel', label: 'Panel / final rounds', sub: 'Multiple people, pressure' },
    ],
    emails: [
        { id: 'clients', label: 'Client communication', sub: 'Where tone really matters' },
        { id: 'internal', label: 'Internal updates', sub: 'Team & cross-functional' },
        { id: 'sensitive', label: 'Difficult conversations', sub: 'Pushback, declining, escalations' },
        { id: 'cold', label: 'Cold outreach', sub: 'Sales, networking, intros' },
    ],
    presentations: [
        { id: 'execs', label: 'Executive reviews', sub: 'Sharp questions from leaders' },
        { id: 'demos', label: 'Product demos', sub: 'Showing work to stakeholders' },
        { id: 'conferences', label: 'Conferences & panels', sub: 'Large audiences' },
        { id: 'team', label: 'Team presentations', sub: 'Internal knowledge sharing' },
    ],
};

const blockerOptions = [
    { id: 'freeze', label: 'I freeze and forget words I know', icon: BookX, color: colors.coral },
    { id: 'translate', label: 'I translate in my head — too slow', icon: Brain, color: colors.amber },
    { id: 'pronunciation', label: "I'm self-conscious about my accent", icon: Volume2, color: colors.sage },
    { id: 'vocabulary', label: 'I lack the specific work vocabulary', icon: FileText, color: colors.inkSoft },
];

const pastAttemptOptions = [
    { id: 'apps', label: 'Apps that felt like games', sub: 'Duolingo, Babbel — fun but no real progress' },
    { id: 'tutor', label: 'Generic tutors on iTalki', sub: 'Nice people, but not focused on my goals' },
    { id: 'youtube', label: 'YouTube & podcasts', sub: 'Passive — never got me speaking' },
    { id: 'never', label: "Haven't really tried before", sub: "Just starting to take this seriously" },
];

// ============================================================
// IMAGE PLACEHOLDER COMPONENT
// ============================================================
function ImagePlaceholder({ prompt, aspect = '16/9', label }: { prompt: string; aspect?: string; label: string }) {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                aspectRatio: aspect,
                background: `repeating-linear-gradient(45deg, ${colors.creamDeep}, ${colors.creamDeep} 10px, ${colors.cream} 10px, ${colors.cream} 20px)`,
                border: `2px dashed ${colors.border}`,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center',
            }}
        >
            <div style={{ fontSize: '11px', fontWeight: 700, color: colors.coral, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
                🍌 Nanobanana Slot — {label}
            </div>
            <div style={{ fontSize: '12px', color: colors.muted, fontStyle: 'italic', lineHeight: 1.5, maxWidth: '90%' }}>
                {prompt}
            </div>
        </div>
    );
}

// ============================================================
// AI THINKING INDICATOR
// ============================================================
function AIThinking({ message = 'Analyzing your answer…' }: { message?: string }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 18px', background: colors.sageSoft,
            borderRadius: '999px', fontSize: '13px', color: colors.inkSoft,
            width: 'fit-content', margin: '0 auto',
        }}>
            <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: colors.sage,
                        animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                ))}
            </div>
            <span>{message}</span>
        </div>
    );
}

// ============================================================
// PROGRESS HEADER
// ============================================================
function ProgressHeader({ step }: { step: number }) {
    const phases = [
        { name: 'Goal', range: [1, 2] },
        { name: 'Diagnosis', range: [3, 5] },
        { name: 'Plan', range: [6, 9] },
        { name: 'Result', range: [10, 10] },
    ];

    const currentPhase = phases.findIndex(p => step >= p.range[0] && step <= p.range[1]);
    const percent = step === 0 ? 0 : Math.min(100, (step / 10) * 100);

    if (step === 0 || step > 10) return null;

    return (
        <div style={{ padding: '16px 20px 0', maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {phases.map((p, i) => (
                        <div key={p.name} style={{
                            fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                            color: i <= currentPhase ? colors.ink : colors.muted,
                            opacity: i <= currentPhase ? 1 : 0.5,
                            textTransform: 'uppercase', transition: 'all 0.3s',
                        }}>
                            {p.name}{i < phases.length - 1 && <span style={{ marginLeft: '6px', color: colors.border }}>·</span>}
                        </div>
                    ))}
                </div>
                <div style={{ fontSize: '11px', color: colors.muted, fontWeight: 600 }}>{step} / 10</div>
            </div>
            <div style={{ height: '4px', background: colors.creamDeep, borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%', width: `${percent}%`,
                    background: colors.coral,
                    borderRadius: '999px',
                    transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                }} />
            </div>
        </div>
    );
}

// ============================================================
// CARD CHOICE
// ============================================================
type ChoiceCardProps = {
    selected: boolean;
    onClick: () => void;
    icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
    iconColor?: string;
    label: string;
    sub?: string;
    accent?: string;
};

function ChoiceCard({ selected, onClick, icon: Icon, iconColor, label, sub, accent }: ChoiceCardProps) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%', padding: '16px 18px',
                background: selected ? colors.ink : colors.cream,
                border: `2px solid ${selected ? colors.ink : colors.border}`,
                borderRadius: '14px', textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '14px',
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                transform: selected ? 'scale(1.01)' : 'scale(1)',
                boxShadow: selected ? `0 8px 24px ${colors.ink}25` : `0 1px 0 ${colors.border}50`,
            }}
            onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = colors.coral; }}
            onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border; }}
        >
            {(Icon || accent) && (
                <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: selected ? colors.coral : (iconColor ? `${iconColor}20` : colors.creamDeep),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '20px',
                }}>
                    {Icon ? (
                        <Icon size={20} color={selected ? '#fff' : (iconColor || colors.inkSoft)} strokeWidth={2.2} />
                    ) : (
                        <span>{accent}</span>
                    )}
                </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: selected ? colors.cream : colors.ink, marginBottom: sub ? '2px' : 0, lineHeight: 1.3 }}>
                    {label}
                </div>
                {sub && (
                    <div style={{ fontSize: '12px', color: selected ? colors.creamDeep : colors.muted, lineHeight: 1.4 }}>
                        {sub}
                    </div>
                )}
            </div>
            {selected && <Check size={18} color={colors.coral} strokeWidth={3} />}
        </button>
    );
}

// ============================================================
// STEP CONTAINER
// ============================================================
function StepWrap({ children, stepKey }: { children: React.ReactNode; stepKey: string }) {
    return (
        <div key={stepKey} style={{ animation: 'slideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1)', padding: '24px 20px 100px', maxWidth: '480px', margin: '0 auto' }}>
            {children}
        </div>
    );
}

// ============================================================
// PERSONALIZED HEADER
// ============================================================
function QHeader({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
    return (
        <div style={{ marginBottom: '24px' }}>
            {kicker && (
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: colors.coral, textTransform: 'uppercase', marginBottom: '10px' }}>
                    {kicker}
                </div>
            )}
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: colors.ink, lineHeight: 1.2, marginBottom: subtitle ? '10px' : 0, letterSpacing: '-0.02em' }}>
                {title}
            </h2>
            {subtitle && (
                <p style={{ fontSize: '15px', color: colors.inkSoft, lineHeight: 1.5 }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}

// ============================================================
// CONTINUE BUTTON — sticky bottom
// ============================================================
type StickyButtonProps = {
    onClick: () => void;
    disabled?: boolean;
    label?: string;
    icon?: React.ComponentType<{ size?: number; strokeWidth?: number }> | null;
};

function StickyButton({ onClick, disabled = false, label = 'Continue', icon: Icon = ArrowRight }: StickyButtonProps) {
    return (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            padding: '16px 20px 24px',
            background: `linear-gradient(180deg, transparent, ${colors.cream} 30%)`,
            pointerEvents: 'none',
        }}>
            <div style={{ maxWidth: '480px', margin: '0 auto', pointerEvents: 'auto' }}>
                <button
                    onClick={onClick}
                    disabled={disabled}
                    style={{
                        width: '100%', padding: '16px',
                        background: disabled ? colors.creamDeep : colors.coral,
                        color: disabled ? colors.muted : '#FFFFFF',
                        border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 600,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'all 0.2s',
                        boxShadow: disabled ? 'none' : `0 8px 24px ${colors.coral}40`,
                    }}
                    onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                >
                    {label}
                    {Icon && <Icon size={18} strokeWidth={2.4} />}
                </button>
            </div>
        </div>
    );
}

// ============================================================
// THINKING MESSAGES
// ============================================================
function getThinkingMessage(step: number, answers: CareerAnswers): string {
    if (step === 2) return `Mapping your ${goalShort[answers.q1 ?? ''] || 'goal'} pattern…`;
    if (step === 4) return 'Calculating your urgency score…';
    if (step === 8) return 'Calibrating your starting point…';
    return 'Analyzing your answer…';
}

// ============================================================
// MAIN APP
// ============================================================
export function CareerFunnel() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { step, answers, thinking } = state;

    const setAnswer = (key: keyof CareerAnswers, value: string | number) =>
        dispatch({ type: 'ANSWER', key, value });

    const next = () => {
        if ([2, 4, 8].includes(step)) {
            dispatch({ type: 'THINKING', value: true });
            setTimeout(() => dispatch({ type: 'NEXT' }), 900);
        } else {
            dispatch({ type: 'NEXT' });
        }
    };
    const back = () => dispatch({ type: 'BACK' });

    return (
        <div style={{
            minHeight: '100vh', background: colors.cream,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
            color: colors.ink, position: 'relative',
        }}>
            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 300; }
          to { stroke-dashoffset: 0; }
        }
        button:focus-visible {
          outline: 2px solid ${colors.coral};
          outline-offset: 2px;
        }
      `}</style>

            {step > 0 && step <= 10 && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', maxWidth: '480px', margin: '0 auto', justifyContent: 'space-between' }}>
                    <button
                        onClick={back}
                        disabled={step === 1}
                        style={{ background: 'transparent', border: 'none', cursor: step === 1 ? 'default' : 'pointer', padding: '8px', opacity: step === 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', color: colors.inkSoft }}
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', color: colors.ink }}>
                        LINGUA<span style={{ color: colors.coral }}>AI</span>
                    </div>
                    <div style={{ width: '38px' }} />
                </div>
            )}

            <ProgressHeader step={step} />

            {thinking ? (
                <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px' }}>
                    <AIThinking message={getThinkingMessage(step, answers)} />
                </div>
            ) : (
                <>
                    {step === 0 && <Welcome onStart={next} />}
                    {step === 1 && <Step1Goal answers={answers} setAnswer={setAnswer} onNext={next} />}
                    {step === 2 && <Step2Context answers={answers} setAnswer={setAnswer} onNext={next} />}
                    {step === 3 && <Step3Blocker answers={answers} setAnswer={setAnswer} onNext={next} />}
                    {step === 4 && <Step4Frequency answers={answers} setAnswer={setAnswer} onNext={next} />}
                    {step === 5 && <Step5Insight answers={answers} onNext={next} />}
                    {step === 6 && <Step6Time answers={answers} setAnswer={setAnswer} onNext={next} />}
                    {step === 7 && <Step7PastAttempts answers={answers} setAnswer={setAnswer} onNext={next} />}
                    {step === 8 && <Step8Confidence answers={answers} setAnswer={setAnswer} onNext={next} />}
                    {step === 9 && <Step9Deadline answers={answers} setAnswer={setAnswer} onNext={next} />}
                    {step === 10 && <Step10Email answers={answers} setAnswer={setAnswer} onNext={next} />}
                    {step === 11 && <SuccessScreen answers={answers} />}
                </>
            )}
        </div>
    );
}

// ============================================================
// WELCOME SCREEN
// ============================================================
function Welcome({ onStart }: { onStart: () => void }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 20px', maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.15em', color: colors.ink, marginBottom: '40px' }}>
                LINGUA<span style={{ color: colors.coral }}>AI</span>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <ImagePlaceholder
                    aspect="4/3"
                    label="HERO"
                    prompt="Confident professional in their 30s, mid-conversation in a modern office meeting room. Natural warm lighting (cream/coral tones), slight cinematic depth-of-field. They look engaged, not staged. Editorial style, not stocky. No text overlay."
                />
            </div>

            <h1 style={{ fontSize: '34px', fontWeight: 700, lineHeight: 1.1, color: colors.ink, letterSpacing: '-0.03em', marginBottom: '14px' }}>
                Stop freezing in English at work.
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.5, color: colors.inkSoft, marginBottom: '32px' }}>
                In 90 seconds, our AI diagnoses what&apos;s actually holding you back — and builds a plan that fits 15 minutes a day.
            </p>

            <button
                onClick={onStart}
                style={{
                    padding: '18px', background: colors.coral, color: '#FFFFFF', border: 'none', borderRadius: '14px',
                    fontSize: '16px', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: `0 12px 32px ${colors.coral}40`, transition: 'transform 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
                Start free diagnosis
                <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: colors.muted }}>
                <Sparkles size={13} color={colors.coral} />
                Used by 18,000+ professionals · No signup to start
            </div>
        </div>
    );
}

// ============================================================
// Q1 — GOAL
// ============================================================
type StepProps = { answers: CareerAnswers; setAnswer: (key: keyof CareerAnswers, value: string | number) => void; onNext: () => void };

function Step1Goal({ answers, setAnswer, onNext }: StepProps) {
    const options = [
        { id: 'meetings', icon: Users, color: colors.inkSoft, label: 'Speaking up in meetings', sub: 'Standups, calls, brainstorms' },
        { id: 'interviews', icon: Briefcase, color: colors.coral, label: 'Job interviews', sub: 'Technical and behavioral' },
        { id: 'emails', icon: FileText, color: colors.sage, label: 'Professional writing', sub: 'Emails, Slack, docs' },
        { id: 'presentations', icon: Mic, color: colors.amber, label: 'Presentations & demos', sub: 'Pitching to teams and clients' },
    ];

    return (
        <StepWrap stepKey="q1">
            <QHeader kicker="The diagnosis starts here" title="What's the #1 moment English fails you?" subtitle="Pick the one that costs you most — at work." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {options.map(o => (
                    <ChoiceCard key={o.id} selected={answers.q1 === o.id} onClick={() => setAnswer('q1', o.id)} icon={o.icon} iconColor={o.color} label={o.label} sub={o.sub} />
                ))}
            </div>
            <StickyButton onClick={onNext} disabled={!answers.q1} />
        </StepWrap>
    );
}

// ============================================================
// Q2 — SUB-CONTEXT
// ============================================================
function Step2Context({ answers, setAnswer, onNext }: StepProps) {
    const opts = subContextOptions[answers.q1 ?? ''] ?? subContextOptions.meetings;
    const goalLabel = goalLabels[answers.q1 ?? ''] ?? 'your goal';

    return (
        <StepWrap stepKey="q2">
            <QHeader kicker="Going deeper" title={`When you say "${goalLabel}" — what specifically?`} subtitle="The more specific, the more your plan will hit." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {opts.map(o => (
                    <ChoiceCard key={o.id} selected={answers.q2 === o.id} onClick={() => setAnswer('q2', o.id)} label={o.label} sub={o.sub} />
                ))}
            </div>
            <StickyButton onClick={onNext} disabled={!answers.q2} />
        </StepWrap>
    );
}

// ============================================================
// Q3 — BLOCKER
// ============================================================
function Step3Blocker({ answers, setAnswer, onNext }: StepProps) {
    return (
        <StepWrap stepKey="q3">
            <QHeader kicker="What's really happening" title="In those moments, what breaks first?" subtitle="Be honest. This is the part the app fixes." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {blockerOptions.map(o => (
                    <ChoiceCard key={o.id} selected={answers.q3 === o.id} onClick={() => setAnswer('q3', o.id)} icon={o.icon} iconColor={o.color} label={o.label} />
                ))}
            </div>
            <StickyButton onClick={onNext} disabled={!answers.q3} />
        </StepWrap>
    );
}

// ============================================================
// Q4 — FREQUENCY
// ============================================================
function Step4Frequency({ answers, setAnswer, onNext }: StepProps) {
    const value = answers.q4 ?? 3;
    const labels: Record<number, { text: string; cost: string }> = {
        1: { text: 'Rarely', cost: '< 1 time per month' },
        2: { text: 'Sometimes', cost: '1-2 times per month' },
        3: { text: 'Often', cost: 'Almost every week' },
        4: { text: 'Constantly', cost: 'Multiple times per week' },
        5: { text: 'Every day', cost: "It's the default" },
    };
    const current = labels[value];

    return (
        <StepWrap stepKey="q4">
            <QHeader kicker="The cost of waiting" title={`How often does ${goalShort[answers.q1 ?? ''] ?? 'your work'} put you in this spot?`} />

            <div style={{ background: colors.coralSoft, borderRadius: '16px', padding: '24px 20px', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: colors.ink, marginBottom: '4px', letterSpacing: '-0.02em' }}>{current.text}</div>
                <div style={{ fontSize: '14px', color: colors.inkSoft }}>{current.cost}</div>
            </div>

            <input
                type="range" min="1" max="5" value={value}
                onChange={e => setAnswer('q4', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: colors.coral, marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.muted }}>
                <span>Rarely</span>
                <span>Every day</span>
            </div>

            {value >= 3 && (
                <div style={{ marginTop: '24px', padding: '14px 16px', background: colors.cream, border: `1px solid ${colors.border}`, borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start', animation: 'fadeIn 0.4s' }}>
                    <AlertCircle size={18} color={colors.coral} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <div style={{ fontSize: '13px', color: colors.inkSoft, lineHeight: 1.5 }}>
                        That&apos;s roughly <strong>{value === 5 ? '20+' : value === 4 ? '8-12' : '4-6'} missed moments per month.</strong> Most of our users join here.
                    </div>
                </div>
            )}

            <StickyButton onClick={onNext} disabled={answers.q4 === undefined} />
        </StepWrap>
    );
}

// ============================================================
// Q5 — INSIGHT (no answer stored)
// ============================================================
function Step5Insight({ answers, onNext }: { answers: CareerAnswers; onNext: () => void }) {
    const blockerCopy: Record<string, { headline: string; body: string; stat: string; statLabel: string }> = {
        freeze: {
            headline: "You don't have a vocabulary problem.",
            body: `You have a retrieval problem. The words are there — they just don't come fast enough under pressure.`,
            stat: '73%', statLabel: 'of professionals say the same thing',
        },
        translate: {
            headline: 'Your brain is doing double work.',
            body: `Translating from your native language is slow by design. The fix isn't more vocab — it's rewiring how you think in English.`,
            stat: '2.3x', statLabel: 'faster after 6 weeks of targeted practice',
        },
        pronunciation: {
            headline: 'Your accent is probably fine.',
            body: `What's actually happening: you avoid words you're unsure about, which makes your English feel "smaller" than it is.`,
            stat: '89%', statLabel: 'of pronunciation anxiety is internal',
        },
        vocabulary: {
            headline: "Generic English isn't your problem.",
            body: `You need the specific 800-1200 words that show up in ${goalShort[answers.q1 ?? ''] || 'your work'} — not a 10,000-word dictionary.`,
            stat: '~1,000', statLabel: 'words covers 95% of your real situations',
        },
    };
    const insight = blockerCopy[answers.q3 ?? ''] ?? blockerCopy.freeze;

    return (
        <StepWrap stepKey="q5">
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: colors.coral, textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} /> AI Insight · Based on your answers
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 700, color: colors.ink, lineHeight: 1.15, marginBottom: '14px', letterSpacing: '-0.02em' }}>
                {insight.headline}
            </h2>
            <p style={{ fontSize: '15px', color: colors.inkSoft, lineHeight: 1.6, marginBottom: '24px' }}>{insight.body}</p>

            <div style={{ background: colors.ink, borderRadius: '18px', padding: '24px', color: colors.cream, marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', fontWeight: 700, color: colors.coral, lineHeight: 1, marginBottom: '6px', letterSpacing: '-0.03em' }}>{insight.stat}</div>
                <div style={{ fontSize: '13px', color: colors.creamDeep, lineHeight: 1.4 }}>{insight.statLabel}</div>
            </div>

            <div style={{ padding: '14px 16px', background: colors.sageSoft, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Check size={16} color={colors.sage} strokeWidth={3} />
                <span style={{ fontSize: '13px', color: colors.inkSoft }}>We&apos;re already shaping your plan around this.</span>
            </div>

            <StickyButton onClick={onNext} label="Keep going" />
        </StepWrap>
    );
}

// ============================================================
// Q6 — TIME AVAILABLE
// ============================================================
function Step6Time({ answers, setAnswer, onNext }: StepProps) {
    const value = answers.q6 ?? 15;

    return (
        <StepWrap stepKey="q6">
            <QHeader kicker="Building your plan" title="Realistically — how much time per day?" subtitle="Pick the number you'll actually hit on busy days. Not your ideal day." />

            <div style={{ background: colors.creamDeep, borderRadius: '18px', padding: '28px 20px', textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '56px', fontWeight: 700, color: colors.ink, lineHeight: 1, letterSpacing: '-0.04em' }}>
                    {value}
                    <span style={{ fontSize: '20px', color: colors.muted, marginLeft: '4px', fontWeight: 500 }}>min</span>
                </div>
                <div style={{ fontSize: '13px', color: colors.muted, marginTop: '6px' }}>per day</div>
            </div>

            <input type="range" min="5" max="30" step="5" value={value} onChange={e => setAnswer('q6', parseInt(e.target.value))} style={{ width: '100%', accentColor: colors.coral, marginBottom: '12px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.muted }}>
                <span>5 min</span><span>15 min</span><span>30 min</span>
            </div>

            <div style={{ marginTop: '20px', padding: '14px 16px', background: colors.cream, border: `1px solid ${colors.border}`, borderRadius: '12px', fontSize: '13px', color: colors.inkSoft, lineHeight: 1.5 }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} color={colors.coral} />
                {value <= 10 ? "Short sessions — we'll focus on micro-practice between meetings." : value <= 20 ? 'A real practice window. Perfect for our morning routine.' : 'Deep work mode. Your plan can include longer scenario simulations.'}
            </div>

            <StickyButton onClick={onNext} />
        </StepWrap>
    );
}

// ============================================================
// Q7 — PAST ATTEMPTS
// ============================================================
function Step7PastAttempts({ answers, setAnswer, onNext }: StepProps) {
    return (
        <StepWrap stepKey="q7">
            <QHeader kicker="Learning from what didn't work" title="When you've tried before — what killed it?" subtitle="So we don't repeat the same mistake." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pastAttemptOptions.map(o => (
                    <ChoiceCard key={o.id} selected={answers.q7 === o.id} onClick={() => setAnswer('q7', o.id)} label={o.label} sub={o.sub} />
                ))}
            </div>
            <StickyButton onClick={onNext} disabled={!answers.q7} />
        </StepWrap>
    );
}

// ============================================================
// Q8 — CONFIDENCE BASELINE
// ============================================================
function Step8Confidence({ answers, setAnswer, onNext }: StepProps) {
    const value = answers.q8 ?? 0;
    const goalContext = goalShort[answers.q1 ?? ''] || 'a work conversation';

    return (
        <StepWrap stepKey="q8">
            <QHeader kicker="The honest baseline" title={`Right now — how do you feel walking into ${goalContext}?`} subtitle="No judgment. We need the real number to measure progress." />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setAnswer('q8', n)} style={{
                        flex: 1, aspectRatio: '1', border: `2px solid ${value === n ? colors.ink : colors.border}`,
                        background: value === n ? colors.ink : colors.cream,
                        color: value === n ? colors.cream : colors.ink,
                        borderRadius: '12px', fontSize: '20px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                        {n}
                    </button>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: colors.muted, marginBottom: '20px' }}>
                <span>Dread it</span><span>Crush it</span>
            </div>

            {value > 0 && (
                <div style={{ padding: '16px', background: value <= 2 ? colors.coralSoft : value <= 3 ? colors.creamDeep : colors.sageSoft, borderRadius: '12px', fontSize: '13px', color: colors.inkSoft, lineHeight: 1.5, animation: 'fadeIn 0.3s' }}>
                    {value <= 2 && '🎯 You\'re exactly who LinguaAI was built for. We start with low-stakes scenarios.'}
                    {value === 3 && '👍 You have a foundation — we just need to close the confidence gap.'}
                    {value >= 4 && '💪 You\'re already solid. We\'ll push you into edge cases and high-pressure moments.'}
                </div>
            )}

            <StickyButton onClick={onNext} disabled={!answers.q8} />
        </StepWrap>
    );
}

// ============================================================
// Q9 — DEADLINE
// ============================================================
function Step9Deadline({ answers, setAnswer, onNext }: StepProps) {
    const presets = [
        { id: '4w', label: '4 weeks', sub: 'I have something coming up' },
        { id: '8w', label: '8 weeks', sub: 'Steady, focused window' },
        { id: '12w', label: '12 weeks', sub: 'Build it solidly' },
        { id: 'open', label: 'No deadline', sub: 'Just want to make progress' },
    ];

    return (
        <StepWrap stepKey="q9">
            <QHeader kicker="Setting the finish line" title="By when do you want to feel different?" subtitle="A specific deadline doubles your follow-through. Pick what feels real." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {presets.map(p => (
                    <ChoiceCard key={p.id} selected={answers.q9 === p.id} onClick={() => setAnswer('q9', p.id)} label={p.label} sub={p.sub} />
                ))}
            </div>
            <StickyButton onClick={onNext} disabled={!answers.q9} />
        </StepWrap>
    );
}

// ============================================================
// Q10 — EMAIL
// ============================================================
function Step10Email({ answers, setAnswer, onNext }: StepProps) {
    const [email, setEmail] = useState(answers.q10 || '');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const goalLabel = goalShort[answers.q1 ?? ''] || 'English at work';
    const timeStr = answers.q6 ? `${answers.q6}-min` : '15-min';
    const startLevel = answers.q8 || 2;
    const targetLevel = Math.min(5, startLevel + 2);

    const validate = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const handleSubmit = async () => {
        if (!validate(email)) {
            setError('That email looks off — double-check it?');
            return;
        }
        setError('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/career-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    answers: { ...answers, q10: email },
                }),
            });
            if (!res.ok) {
                setError('Something went wrong. Please try again.');
                setSubmitting(false);
                return;
            }
        } catch {
            setError('Something went wrong. Please try again.');
            setSubmitting(false);
            return;
        }

        setAnswer('q10', email);
        setSubmitting(false);
        onNext();
    };

    return (
        <StepWrap stepKey="q10">
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: colors.coral, textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} /> Your plan is ready
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 700, color: colors.ink, lineHeight: 1.2, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                Here&apos;s what we built for you.
            </h2>
            <p style={{ fontSize: '14px', color: colors.muted, marginBottom: '20px' }}>
                Preview below. Unlock with your email to start.
            </p>

            <div style={{ background: colors.ink, borderRadius: '20px', padding: '24px', color: colors.cream, marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '11px', color: colors.coral, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px' }}>YOUR PERSONALIZED PATH</div>
                <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', lineHeight: 1.3 }}>
                    {timeStr}-a-day plan for {goalLabel}
                </div>

                <ProgressGraph startLevel={startLevel} targetLevel={targetLevel} weeks={answers.q9 === '4w' ? 4 : answers.q9 === '8w' ? 8 : 12} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    <PlanFeature icon={Target} text={`Daily focus: ${goalLabels[answers.q1 ?? ''] || 'your work scenarios'}`} />
                    <PlanFeature icon={Brain} text={`Tuned to fix: ${blockerOptions.find(b => b.id === answers.q3)?.label.toLowerCase() || 'your specific blocker'}`} />
                    <PlanFeature icon={Zap} text="AI roleplay scenarios with instant feedback" />
                </div>
            </div>

            <div style={{ background: colors.cream, border: `2px solid ${colors.border}`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <Lock size={16} color={colors.coral} />
                    <div style={{ fontSize: '14px', fontWeight: 600, color: colors.ink }}>Unlock your plan</div>
                </div>
                <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@work.com"
                    style={{
                        width: '100%', padding: '14px 16px',
                        border: `1.5px solid ${error ? colors.coral : colors.border}`,
                        borderRadius: '10px', fontSize: '15px', background: '#fff',
                        color: colors.ink, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s',
                    }}
                />
                {error && (
                    <div style={{ fontSize: '12px', color: colors.coral, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={12} /> {error}
                    </div>
                )}
                <div style={{ fontSize: '11px', color: colors.muted, marginTop: '10px', lineHeight: 1.5 }}>
                    We email your plan + first lesson immediately. No spam, unsubscribe in one click.
                </div>
            </div>

            <StickyButton
                onClick={handleSubmit}
                disabled={!email || submitting}
                label={submitting ? 'Sending your plan…' : 'Send my plan'}
                icon={submitting ? Loader2 : Unlock}
            />
        </StepWrap>
    );
}

function PlanFeature({ icon: Icon, text }: { icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; text: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${colors.coral}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color={colors.coral} strokeWidth={2.5} />
            </div>
            <div style={{ fontSize: '13px', color: colors.creamDeep, lineHeight: 1.4 }}>{text}</div>
        </div>
    );
}

// ============================================================
// PROGRESS GRAPH
// ============================================================
function ProgressGraph({ startLevel, targetLevel, weeks }: { startLevel: number; targetLevel: number; weeks: number }) {
    const points: Array<{ x: number; y: number }> = [];
    for (let i = 0; i <= weeks; i++) {
        const progress = i / weeks;
        const eased = 1 - Math.pow(1 - progress, 1.6);
        const level = startLevel + (targetLevel - startLevel) * eased;
        points.push({ x: (i / weeks) * 100, y: 100 - (level / 5) * 80 - 10 });
    }
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <div style={{ background: `${colors.cream}10`, borderRadius: '12px', padding: '12px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: colors.creamDeep, marginBottom: '8px' }}>
                <span>Level {startLevel} today</span>
                <span style={{ color: colors.coral, fontWeight: 600 }}>Level {targetLevel} in {weeks}w</span>
            </div>
            <svg viewBox="0 0 100 60" style={{ width: '100%', height: '60px', display: 'block' }}>
                <defs>
                    <linearGradient id="career-graph-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.coral} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={colors.coral} stopOpacity={0} />
                    </linearGradient>
                </defs>
                {[20, 40, 60, 80].map(y => (
                    <line key={y} x1="0" y1={y / 100 * 60} x2="100" y2={y / 100 * 60} stroke={colors.cream} strokeOpacity={0.1} strokeWidth={0.3} />
                ))}
                <path d={`${pathD} L 100 60 L 0 60 Z`} fill="url(#career-graph-gradient)" />
                <path d={pathD} fill="none" stroke={colors.coral} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="300" style={{ animation: 'drawLine 1.4s ease-out forwards' }} />
                <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={2} fill={colors.coral} />
            </svg>
        </div>
    );
}

// ============================================================
// SUCCESS SCREEN
// ============================================================
function SuccessScreen({ answers }: { answers: CareerAnswers }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: colors.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: `0 12px 32px ${colors.coral}40`, animation: 'fadeIn 0.6s' }}>
                <Check size={40} color="#fff" strokeWidth={3} />
            </div>

            <h1 style={{ fontSize: '30px', fontWeight: 700, color: colors.ink, lineHeight: 1.15, marginBottom: '14px', letterSpacing: '-0.02em' }}>
                Your plan is on the way.
            </h1>
            <p style={{ fontSize: '15px', color: colors.inkSoft, lineHeight: 1.5, marginBottom: '32px' }}>
                Check <strong>{answers.q10}</strong> in the next 2 minutes. Your first lesson is already inside.
            </p>

            <div style={{ width: '100%', marginBottom: '24px' }}>
                <ImagePlaceholder
                    aspect="4/3"
                    label="SUCCESS"
                    prompt="Same person from the hero image, now smiling slightly, looking at their phone. Warm cream lighting, coral accents. Subtle hint of accomplishment — not over-the-top happiness. Editorial photography style."
                />
            </div>

            <div style={{ width: '100%', padding: '20px', background: colors.creamDeep, borderRadius: '14px', marginBottom: '20px', textAlign: 'left' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: colors.coral, letterSpacing: '0.1em', marginBottom: '10px' }}>WHAT HAPPENS NEXT</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <NextStep n="1" text="Open the email — your plan is the first thing inside." />
                    <NextStep n="2" text="Try your first AI roleplay (no app install needed)." />
                    <NextStep n="3" text="Day 7: we check in and adjust your plan." />
                </div>
            </div>

            <div style={{ fontSize: '12px', color: colors.muted }}>
                Didn&apos;t get it? Check spam, or reply to any LinguaAI email.
            </div>
        </div>
    );
}

function NextStep({ n, text }: { n: string; text: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: colors.ink, color: colors.cream, fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {n}
            </div>
            <div style={{ fontSize: '13px', color: colors.inkSoft, lineHeight: 1.5, paddingTop: '3px' }}>{text}</div>
        </div>
    );
}
