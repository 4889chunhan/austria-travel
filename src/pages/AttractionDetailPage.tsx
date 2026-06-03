import { useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import {
  ArrowUpRight,
  Bus,
  Car,
  Clock,
  ExternalLink,
  Heart,
  Info,
  Share2,
  Tag,
  Train,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '../store';
import { attractions } from '../data/attractions';
import { CATEGORY_META, primaryCategory } from '../utils/categoryColors';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { LanguageCard } from '../components/LanguageCard';
import { cn } from '../utils/cn';
import { CITY_DISPLAY } from '../utils/cityDisplay';
import type { Attraction } from '../types';

export function AttractionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const attraction = useMemo(
    () => attractions.find((a) => a.slug === slug),
    [slug],
  );

  if (!attraction) return <NotFound />;
  return <DetailView attraction={attraction} />;
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="mb-4 font-serif text-4xl italic text-ink">
        找不到這個景點
      </h1>
      <p className="mb-6 font-chinese text-[15px] text-ink-muted">
        URL 可能輸入錯誤,或這個景點還沒有資料。
      </p>
      <Link to="/map" className="btn-primary">
        回到地圖
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Main view
   --------------------------------------------------------------------------- */

function DetailView({ attraction }: { attraction: Attraction }) {
  const { i18n } = useTranslation();
  const localized = useLocalizedField();
  const toggleSaved = useStore((s) => s.toggleSaved);
  const isSaved = useStore((s) =>
    s.savedAttractions.includes(attraction.id),
  );

  // Refs for the GSAP ScrollTrigger parallax/fade on the hero.
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const img = heroImgRef.current;
    if (!hero || !img) return;

    // The Layout's <main> is the scrolling container (overflow-y-auto) — we
    // have to point ScrollTrigger at it explicitly, otherwise it watches the
    // window which never scrolls in this app.
    let scroller: HTMLElement | undefined;
    let el: HTMLElement | null = hero.parentElement;
    while (el) {
      const oy = getComputedStyle(el).overflowY;
      if (oy === 'auto' || oy === 'scroll') {
        scroller = el;
        break;
      }
      el = el.parentElement;
    }

    // Zoom IN while fading out — the image grows toward the camera as the
    // content scrolls up and covers it (Ken-Burns-into-fade).
    const tween = gsap.to(img, {
      scale: 1.5,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        scroller,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Refresh once the route-transition wrapper finishes its entry animation —
    // start positions can shift slightly during the page-enter keyframe.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      window.clearTimeout(refresh);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [attraction.id]);

  const meta = primaryCategory(attraction.category);
  const cityLabel =
    CITY_DISPLAY[attraction.city] ?? { zh: attraction.city, en: attraction.city };
  const HeroIcon = meta.icon;
  const isZh = i18n.language.startsWith('zh');

  const description = localized(attraction.description);
  const dropChar = description.charAt(0);
  const restOfDesc = description.slice(1);

  const nearby = useMemo(
    () =>
      attractions.filter(
        (a) => a.city === attraction.city && a.id !== attraction.id,
      ),
    [attraction.city, attraction.id],
  );

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      void navigator
        .share({
          title: localized(attraction.name),
          url: window.location.href,
        })
        .catch(() => {
          /* user dismissed */
        });
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="relative bg-cream">
      {/* ============ HERO (sticky behind content) ============
          Stays glued to the top of the scroll viewport. GSAP ScrollTrigger
          scrubs scale + opacity on the image as the user scrolls. */}
      <div
        ref={heroRef}
        className="sticky top-0 z-0 h-[40vh] w-full overflow-hidden md:h-[55vh]"
      >
        <img
          ref={heroImgRef}
          src={attraction.imageUrl}
          alt={localized(attraction.name)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            borderRadius: 0,
            transformOrigin: 'center',
            willChange: 'transform, opacity',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, var(--color-cream) 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute inline-flex items-center gap-2"
          style={{
            bottom: 48,
            left: 24,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '0.5px solid rgba(255, 255, 255, 0.6)',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 16px',
            boxShadow: 'var(--shadow-float)',
          }}
        >
          <HeroIcon size={14} style={{ color: meta.color }} strokeWidth={2.2} />
          <span className="font-chinese text-[13px] font-medium text-ink">
            {cityLabel.zh}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
            · {meta.en}
          </span>
        </div>
      </div>

      {/* ============ CONTENT — slides up over the hero ============
          Two-column layout: 附近景點 left, everything else (title, info,
          transport, language cards) right. `min-h-screen` so the content
          extends past the sticky hero down to the footer. */}
      <article className="relative z-10 -mt-6 min-h-screen bg-cream pb-16 pt-8">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* LEFT column — 附近景點 */}
            <aside className="lg:col-span-3">
              {nearby.length > 0 && (
                <div>
                  <h2 className="mb-4 font-chinese text-[18px] font-medium text-ink">
                    附近景點
                    <span className="ml-2 font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
                      · {cityLabel.en}
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {nearby.map((a) => (
                      <NearbyCard key={a.id} attraction={a} compact />
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* RIGHT column — meta, title, description + info card, transport, language cards */}
            <div className="lg:col-span-9">
              {/* TOP META */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-pill bg-lime px-2.5 py-1 font-mono uppercase tracking-editorial text-lime-deep"
                  style={{ fontSize: 10 }}
                >
                  {cityLabel.en}
                </span>
                {attraction.category.map((c) => {
                  const m = CATEGORY_META[c];
                  return (
                    <span
                      key={c}
                      className="rounded-pill px-2.5 py-1 font-mono uppercase tracking-editorial"
                      style={{
                        background: hexAlpha(m.color, 0.15),
                        color: m.color,
                        fontSize: 10,
                      }}
                    >
                      {m.en}
                    </span>
                  );
                })}
                <button
                  type="button"
                  onClick={() => toggleSaved(attraction.id)}
                  aria-pressed={isSaved}
                  className={cn(
                    'ml-auto inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-chinese text-[12px] font-medium transition-colors',
                    isSaved ? 'bg-lime text-lime-deep' : 'text-ink-muted hover:text-ink',
                  )}
                  style={
                    !isSaved ? { border: '1px solid var(--color-border-med)' } : undefined
                  }
                >
                  <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={2} />
                  {isSaved ? '已收藏' : '收藏'}
                </button>
              </div>

              {/* NAME BLOCK */}
              <header className="mt-5">
                <h1
                  className="font-chinese text-ink"
                  style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1 }}
                >
                  {attraction.name.zh}
                </h1>
                <p
                  className="mt-1 font-serif italic text-ink-muted"
                  style={{ fontSize: 26, lineHeight: 1.2 }}
                >
                  {attraction.name.en}
                </p>
                <p className="mt-1 font-german text-ink-faint" style={{ fontSize: 15 }}>
                  {attraction.name.de}
                </p>
              </header>

              {/* DESCRIPTION + INFO CARD (inner 7/5 split) */}
              <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12">
                <div className="md:col-span-7">
                  <p
                    className="font-chinese text-ink"
                    style={{ fontSize: 16, lineHeight: 1.85 }}
                  >
                    <span
                      aria-hidden
                      className={isZh ? 'font-chinese' : 'font-serif'}
                      style={{
                        float: 'left',
                        fontSize: 64,
                        fontWeight: 700,
                        lineHeight: 1,
                        marginRight: 12,
                        marginTop: 6,
                        color: 'var(--color-ink)',
                      }}
                    >
                      {dropChar}
                    </span>
                    {restOfDesc}
                  </p>
                  <div style={{ clear: 'both' }} />
                </div>

                <aside className="md:col-span-5">
                  <InfoCard attraction={attraction} onShare={handleShare} />
                </aside>
              </div>

              {/* TRANSPORT */}
              <TransportSection />

              {/* LANGUAGE CARDS */}
              <section className="mt-16">
                <div className="mb-6 flex items-baseline gap-3">
                  <h2 className="font-serif italic text-ink" style={{ fontSize: 36 }}>
                    語言小卡
                  </h2>
                  <p className="font-german text-[14px] text-ink-muted">
                    Language cards
                  </p>
                </div>
                {attraction.languageCards.length > 0 ? (
                  <div
                    className="scrollbar-hidden flex gap-3 overflow-x-auto pb-1"
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    {attraction.languageCards.map((card) => (
                      <div
                        key={card.id}
                        className="shrink-0"
                        style={{ scrollSnapAlign: 'start', width: 280 }}
                      >
                        <LanguageCard card={card} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-chinese text-[14px] text-ink-faint">
                    這個景點還沒有語言小卡。
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Sticky info card
   --------------------------------------------------------------------------- */

function InfoCard({
  attraction,
  onShare,
}: {
  attraction: Attraction;
  onShare: () => void;
}) {
  const localized = useLocalizedField();
  const toggleSaved = useStore((s) => s.toggleSaved);
  const isSaved = useStore((s) =>
    s.savedAttractions.includes(attraction.id),
  );

  return (
    <div className="card">
      <h3
        className="mb-3 pb-3 font-chinese text-[14px] font-medium text-ink"
        style={{ borderBottom: '0.5px solid var(--color-border)' }}
      >
        資訊
      </h3>

      <div className="space-y-4">
        {attraction.openingHours && (
          <InfoRow
            icon={Clock}
            label="Opening hours"
            value={localized(attraction.openingHours)}
          />
        )}
        {attraction.price && (
          <InfoRow
            icon={Tag}
            label="Price"
            value={localized(attraction.price)}
          />
        )}
        {attraction.tips && (
          <InfoRow
            icon={Info}
            label="Tips"
            value={localized(attraction.tips)}
          />
        )}
      </div>

      <a
        href={attraction.website}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-5 w-full justify-center"
      >
        官方網站
        <ExternalLink size={14} />
      </a>
      <button
        type="button"
        onClick={() => toggleSaved(attraction.id)}
        className="btn-secondary mt-2 w-full justify-center"
      >
        <Heart
          size={14}
          fill={isSaved ? 'currentColor' : 'none'}
          strokeWidth={2}
        />
        {isSaved ? '已加入行程' : '加入行程'}
      </button>
      <button
        type="button"
        onClick={onShare}
        className="btn-secondary mt-2 w-full justify-center"
      >
        <Share2 size={14} />
        分享景點
      </button>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon
        size={14}
        strokeWidth={1.8}
        className="mt-1 shrink-0 text-ink-muted"
      />
      <div className="min-w-0">
        <p
          className="font-mono uppercase tracking-editorial text-ink-faint"
          style={{ fontSize: 10 }}
        >
          {label}
        </p>
        <p className="mt-0.5 font-chinese leading-relaxed text-ink" style={{ fontSize: 13 }}>
          {value}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Transport — placeholder data until a real TransportRoute dataset exists.
   --------------------------------------------------------------------------- */

function TransportSection() {
  return (
    <section className="card mt-12">
      <h2 className="mb-4 font-chinese text-[16px] font-medium text-ink">
        如何前往
      </h2>
      <div className="space-y-4">
        <TransportRow
          icon={Train}
          type="火車"
          duration="2h 30min"
          operator="ÖBB Railjet"
        />
        <TransportRow
          icon={Bus}
          type="巴士"
          duration="3h 15min"
          operator="FlixBus"
        />
        <TransportRow
          icon={Car}
          type="自駕"
          duration="2h 45min"
          operator="A1 西部高速公路"
        />
      </div>
    </section>
  );
}

function TransportRow({
  icon: Icon,
  type,
  duration,
  operator,
}: {
  icon: LucideIcon;
  type: string;
  duration: string;
  operator: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          background: 'var(--color-lime)',
          borderRadius: 'var(--radius-pill)',
        }}
      >
        <Icon
          size={16}
          strokeWidth={2}
          style={{ color: 'var(--color-lime-deep)' }}
        />
      </div>
      <span className="font-chinese text-[14px] text-ink">{type}</span>
      <div className="ml-auto flex items-center gap-2">
        <span
          className="rounded-pill px-2.5 py-0.5 font-mono text-ink"
          style={{ background: 'var(--color-cream)', fontSize: 12 }}
        >
          {duration}
        </span>
        <span className="font-chinese text-[14px] text-ink-muted">
          {operator}
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Nearby cards (horizontal scroll)
   --------------------------------------------------------------------------- */

function NearbyCard({
  attraction,
  compact = false,
}: {
  attraction: Attraction;
  compact?: boolean;
}) {
  const localized = useLocalizedField();
  const cityLabel =
    CITY_DISPLAY[attraction.city] ?? { zh: attraction.city, en: attraction.city };

  return (
    <Link
      to={`/attraction/${attraction.slug}`}
      className={cn('card card-hover block overflow-hidden', compact && 'w-full')}
      style={{ width: compact ? '100%' : 180, padding: 0 }}
    >
      <div
        className="relative"
        style={{
          height: 120,
          background: 'var(--color-cream)',
          borderTopLeftRadius: 'var(--radius-md)',
          borderTopRightRadius: 'var(--radius-md)',
        }}
      >
        <img
          src={attraction.imageUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ borderRadius: 0 }}
        />
      </div>
      <div className="p-3">
        <p
          className="font-chinese text-[13px] font-medium leading-tight text-ink"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {localized(attraction.name)}
        </p>
        <span
          className="mt-2 inline-block rounded-pill bg-lime px-2 py-0.5 font-mono uppercase tracking-editorial text-lime-deep"
          style={{ fontSize: 10 }}
        >
          {cityLabel.en}
        </span>
      </div>
    </Link>
  );
}

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

function hexAlpha(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const num = parseInt(m[1], 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}
