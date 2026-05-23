import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import type { ChatMessage } from '../types';

const SUGGESTIONS = [
  '🌧 我想加雨天備案景點',
  '💰 預算有限，幫我省錢',
  '👶 我帶小孩，調整行程',
  '🎵 增加更多音樂體驗',
] as const;

const SEND_COOLDOWN_MS = 3000;
const MAX_USER_TURNS = 20;
const TEXTAREA_MAX_HEIGHT = 72; // ~3 lines

/**
 * AI trip-planning assistant. Embedded in the PlanPage left panel by default
 * (320px tall); pass variant="page" for the full-height /chat layout.
 *
 * The model call happens in the store (`sendChatMessage`), which talks to a
 * backend proxy — the Claude API key never reaches the browser.
 */
export function PlanChatbot({
  variant = 'embedded',
}: {
  variant?: 'embedded' | 'page';
}) {
  const chatHistory = useStore((s) => s.chatHistory);
  const chatLoading = useStore((s) => s.chatLoading);
  const sendChatMessage = useStore((s) => s.sendChatMessage);
  const clearChat = useStore((s) => s.clearChat);

  const [draft, setDraft] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const userTurns = chatHistory.filter((m) => m.role === 'user').length;
  const capReached = userTurns >= MAX_USER_TURNS;
  const isEmpty = chatHistory.length === 0;

  // Auto-scroll to the newest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatHistory.length, chatLoading]);

  const resetTextarea = () => {
    const ta = textareaRef.current;
    if (ta) ta.style.height = 'auto';
  };

  const autoGrow = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || chatLoading || cooldown || capReached) return;
    void sendChatMessage(trimmed);
    setDraft('');
    resetTextarea();
    // Frontend rate limit: 1 send / 3s.
    setCooldown(true);
    window.setTimeout(() => setCooldown(false), SEND_COOLDOWN_MS);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(draft);
    }
  };

  const canSend = draft.trim().length > 0 && !chatLoading && !cooldown && !capReached;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: 'var(--color-card)',
        border: '0.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        height: variant === 'page' ? '100%' : 320,
      }}
    >
      {/* Header */}
      <div
        className="flex shrink-0 items-center justify-between gap-2 border-b px-4"
        style={{ height: 40 }}
      >
        <span className="flex items-center gap-1.5 font-chinese text-[13px] font-medium text-ink">
          <Sparkles size={14} className="text-lime-dark" />
          AI 行程助手
        </span>
        {!isEmpty && (
          <button
            type="button"
            onClick={clearChat}
            className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint transition-colors hover:text-ink"
          >
            清除對話
          </button>
        )}
      </div>

      {/* Message area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="max-w-[260px] font-chinese text-[13px] leading-relaxed text-ink-muted">
              用一句話描述你的理想旅程，AI 會幫你調整行程。
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={chatLoading || cooldown}
                  className="rounded-pill px-2.5 py-1 font-chinese text-[11px] text-ink-muted transition-colors hover:text-lime-deep disabled:opacity-50"
                  style={{ border: '0.5px solid var(--color-border-med)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {chatHistory.map((msg) => (
              <Bubble key={msg.id} msg={msg} />
            ))}
            {chatLoading && <LoadingBubble />}
          </ul>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="flex shrink-0 items-end gap-2 border-t px-3 py-2"
        style={{ minHeight: 48 }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={draft}
          disabled={capReached}
          onChange={(e) => {
            setDraft(e.target.value);
            autoGrow();
          }}
          onKeyDown={onKeyDown}
          placeholder={
            capReached
              ? '已達對話上限，請重新整理頁面'
              : '描述你的需求，例如：我想加一個適合雨天的室內景點…'
          }
          className="max-h-[72px] min-w-0 flex-1 resize-none self-center bg-transparent font-chinese text-[13px] leading-relaxed text-ink outline-none placeholder:text-ink-faint disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="送出"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-lime text-lime-deep transition hover:bg-[#C2DAAC] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowUp size={16} strokeWidth={2.4} />
        </button>
      </form>
    </div>
  );
}

/* ---- Message bubbles ------------------------------------------------------- */

function Bubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <li className="flex justify-end">
        <span
          className="max-w-[85%] whitespace-pre-wrap font-chinese text-[13px] leading-relaxed text-lime-deep"
          style={{
            background: 'var(--color-lime)',
            borderRadius: '12px 12px 0 12px',
            padding: '10px 14px',
          }}
        >
          {msg.content}
        </span>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <Avatar />
        <span
          className="max-w-[85%] whitespace-pre-wrap font-chinese text-[13px] leading-relaxed text-ink"
          style={{
            background: 'var(--color-cream)',
            borderRadius: '0 12px 12px 12px',
            padding: '10px 14px',
          }}
        >
          {msg.content}
        </span>
      </div>
      {msg.patchNote && (
        <div
          className="ml-7 font-chinese text-[12px] text-lime-deep"
          style={{
            background: '#F0FAF0',
            borderLeft: '3px solid var(--color-lime)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
          }}
        >
          ✓ 行程已更新 — {msg.patchNote}
        </div>
      )}
    </li>
  );
}

function LoadingBubble() {
  return (
    <li className="flex items-start gap-2">
      <Avatar />
      <span
        className="flex items-center gap-1"
        style={{
          background: 'var(--color-cream)',
          borderRadius: '0 12px 12px 12px',
          padding: '12px 14px',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block rounded-pill"
            style={{
              width: 6,
              height: 6,
              background: 'var(--color-lime-dark)',
              animation: 'dot-bounce 1s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </span>
    </li>
  );
}

function Avatar() {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-pill font-mono text-lime-deep"
      style={{ width: 20, height: 20, background: 'var(--color-lime)', fontSize: 9 }}
    >
      AI
    </span>
  );
}
