import { useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '../utils/cn';

const NAV_ITEMS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/plan', key: 'nav.plan', end: false },
  { to: '/map', key: 'nav.map', end: false },
  { to: '/itinerary', key: 'nav.itinerary', end: false },
] as const;

export function Layout() {
  const { t, i18n } = useTranslation();

  // Keep <html lang> in sync so the `html[lang="en"] body` CSS rule fires
  // (swaps body font from Chinese stack to Ubuntu in English mode).
  useEffect(() => {
    const lang = i18n.language.startsWith('zh') ? 'zh-TW' : 'en';
    document.documentElement.lang = lang;
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="sticky top-0 z-30 border-b bg-cream/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-5">
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="font-serif text-2xl leading-none text-ink transition-colors group-hover:text-lime-deep">
              Austria Reise
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-editorial text-ink-faint sm:inline">
              Est. 2026
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <ul className="hidden items-center gap-6 md:flex">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
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
              ))}
            </ul>
            <LanguageSwitcher />
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-24 border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-10 font-mono text-xs uppercase tracking-editorial text-ink-faint sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Austria Reise</span>
          <span>Wien · Salzburg · Hallstatt · Innsbruck</span>
        </div>
      </footer>
    </div>
  );
}
