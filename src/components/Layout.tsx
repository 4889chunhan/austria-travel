import { useEffect, Fragment } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '../utils/cn';

const NAV_ITEMS = [
  { to: '/plan', key: 'nav.plan' },
  { to: '/map', key: 'nav.map' },
  { to: '/phrasebook', key: 'nav.phrasebook' },
  { to: '/chat', key: 'nav.chat' },
] as const;

/**
 * App shell: fixed header, content area below. The content area scrolls for
 * normal pages, but is locked (overflow-hidden) for the map so the map stays
 * pinned and only its sidebar scrolls.
 */
export function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMap = location.pathname === '/map';
  // These pages manage their own internal scroll and hide the global footer:
  // the map, the two-panel plan page, and the full-height chat page.
  const isFullHeight =
    isMap ||
    location.pathname === '/plan' ||
    location.pathname === '/chat';

  // Keep <html lang> in sync so the `html[lang="en"] body` font swap fires.
  useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith('zh')
      ? 'zh-TW'
      : 'en';
  }, [i18n.language]);

  return (
    <div className="flex h-screen flex-col bg-cream">
      <header
        className={cn(
          'z-30 shrink-0 bg-cream/85 backdrop-blur-md',
          !isHome && 'border-b border-[#e5e5e5]',
        )}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-6 py-5 sm:px-8">
          <Link
            to="/"
            className="font-serif text-2xl leading-none text-ink transition-colors hover:text-lime-deep"
          >
            Austria Reise
          </Link>

          <div className="flex items-center gap-5">
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

      <main
        className={cn('flex-1', isFullHeight ? 'overflow-hidden' : 'overflow-y-auto')}
      >
        <Outlet />
        {!isFullHeight && (
          <footer className="mt-24 border-t">
            <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 px-6 py-10 font-mono text-xs uppercase tracking-editorial text-ink-faint sm:flex-row sm:items-center sm:px-8">
              <span>© {new Date().getFullYear()} Austria Reise</span>
              <span>Wien · Salzburg · Hallstatt · Innsbruck</span>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}
