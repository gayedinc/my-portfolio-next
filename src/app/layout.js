import './globals.css';
import { Providers } from './providers';
import GlobalCursor from '../components/GlobalCursor';
import { buildPageMetadata, getServerLocale } from '../lib/siteMetadata';
import { cookies, headers } from 'next/headers';
import { Manrope, Space_Grotesk } from 'next/font/google';

export const dynamic = 'force-dynamic';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-space-grotesk',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-manrope',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

export async function generateMetadata() {
  const locale = await getServerLocale();
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get('x-forwarded-host');
  const host = forwardedHost || requestHeaders.get('host');
  const protocol = requestHeaders.get('x-forwarded-proto') || (host?.startsWith('localhost') ? 'http' : 'https');
  const metadataBase = new URL(host ? `${protocol}://${host}` : 'http://localhost:3000');

  return {
    metadataBase,
    ...buildPageMetadata({ locale, page: 'home' }),
  };
}

export default async function RootLayout({ children }) {
  const locale = await getServerLocale();
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('portfolio_theme')?.value;
  const initialTheme = themeCookie === 'dark-mode' ? 'dark-mode' : 'light';
  const fontClasses = `${spaceGrotesk.variable} ${manrope.variable}`;
  const themeClass = initialTheme === 'dark-mode' ? 'dark-mode' : '';
  const rootClasses = `${fontClasses} ${themeClass}`.trim();

  return (
    <html
      lang={locale}
      className={rootClasses}
      style={{ colorScheme: initialTheme === 'dark-mode' ? 'dark' : 'light' }}
    >
      <body className={rootClasses}>
        <Providers initialLocale={locale} initialTheme={initialTheme}>
          <GlobalCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
