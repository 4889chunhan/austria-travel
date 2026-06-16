import { useEffect, useState, Fragment } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '../utils/cn';

const NAV_ITEMS = [
  { to: '/plan', key: 'nav.plan' },
  { to: '/map', key: 'nav.map' },
  { to: '/stays', key: 'nav.stays' },
  { to: '/phrasebook', key: 'nav.phrasebook' },
  { to: '/chat', key: 'nav.chat' },
] as const;

/**
 * App shell: fixed header, content area below. The content area scrolls for
 * normal pages, but is locked (overflow-hidden) for full-height pages (map,
 * plan, chat) so they manage their own internal scroll.
 */
export function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const isMap = location.pathname === '/map';
  const isChat = location.pathname === '/chat';
  const isPlan = location.pathname === '/plan';
  const isFullHeight = isMap || isPlan || isChat;

  // Map & chat lock the viewport at every width. The plan page only locks on
  // desktop (its two panels scroll independently); on mobile it stacks and
  // scrolls as one normal column.
  const mainOverflow =
    isMap || isChat
      ? 'overflow-hidden'
      : isPlan
      ? 'overflow-y-auto md:overflow-hidden'
      : 'overflow-y-auto';
  const wrapperHeight = isMap || isChat ? 'h-full' : isPlan ? 'md:h-full' : undefined;

  // Page-transition variant: crossfade for split/full-height pages, slide for
  // the collaborative view, gentle rise for everything else.
  const pageVariant = location.pathname.startsWith('/collab')
    ? 'page-enter-slide'
    : isFullHeight
    ? 'page-enter-fade'
    : 'page-enter';

  // Keep <html lang> in sync so the `html[lang="en"] body` font swap fires.
  useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith('zh')
      ? 'zh-TW'
      : 'en';
  }, [i18n.language]);

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen flex-col bg-cream">
      <header
        className={cn(
          'z-30 shrink-0 bg-cream/85 backdrop-blur-md',
          !isHome && 'border-b border-[#e5e5e5]',
        )}
      >
        <nav className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-8 md:flex md:justify-between md:gap-8 md:py-5">
          {/* Mobile hamburger (left) */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="開啟選單"
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center justify-self-start rounded-pill text-ink transition-colors hover:bg-black/5 md:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Logo — centered on mobile, left on desktop */}
          <Link
            to="/"
            className="justify-self-center font-serif text-2xl leading-none text-ink transition-colors hover:text-lime-deep md:justify-self-start"
          >
            Austria Reise
          </Link>

          {/* Right cluster: desktop nav + language toggle */}
          <div className="flex items-center justify-self-end md:gap-5">
            <ul className="hidden items-center md:flex">
              {NAV_ITEMS.map((item, i) => (
                <Fragment key={item.to}>
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="mx-5 h-4 w-px"
                      style={{ background: 'var(--color-border-med)' }}
                    />
                  )}
                  <li>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'font-german text-sm transition-colors',
                          isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                        )
                      }
                    >
                      {t(item.key)}
                    </NavLink>
                  </li>
                </Fragment>
              ))}
            </ul>
            <LanguageSwitcher />
          </div>
        </nav>
      </header>

      <main className={cn('flex-1', mainOverflow)}>
        <div key={location.pathname} className={cn(wrapperHeight, pageVariant)}>
          <Outlet />
        </div>
        {!isFullHeight && (
          <footer className="mt-24 border-t">
            <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 px-6 py-10 font-mono text-xs uppercase tracking-editorial text-ink-faint sm:flex-row sm:items-center sm:px-8">
              <span>© {new Date().getFullYear()} Austria Reise</span>
              <span>Wien · Salzburg · Hallstatt · Innsbruck</span>
            </div>
          </footer>
        )}
      </main>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="主選單">
          <button
            type="button"
            aria-label="關閉選單"
            onClick={() => setMenuOpen(false)}
            className="backdrop-in absolute inset-0 bg-black/30"
          />
          <div
            className="sheet-up absolute inset-x-0 bottom-0 flex flex-col bg-card"
            style={{
              maxHeight: '70vh',
              borderTopLeftRadius: 'var(--radius-xl)',
              borderTopRightRadius: 'var(--radius-xl)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3">
              <span
                aria-hidden
                className="rounded-pill"
                style={{ width: 48, height: 4, background: 'var(--color-ink-faint)' }}
              />
            </div>

            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="關閉選單"
                className="flex h-11 w-11 items-center justify-center rounded-pill text-ink-muted transition-colors hover:bg-black/5"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="flex flex-col pb-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center px-5 font-chinese text-[16px] transition-colors',
                        isActive ? 'text-lime-deep' : 'text-ink hover:text-lime-deep',
                      )
                    }
                    style={{ height: 56, borderBottom: '0.5px solid var(--color-border)' }}
                  >
                    {t(item.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
