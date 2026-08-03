import './globals.css';
import { Providers } from './providers';
import GlobalCursor from '../components/GlobalCursor';
import { buildPageMetadata, getServerLocale } from '../lib/siteMetadata';

export async function generateMetadata() {
  const locale = await getServerLocale();
  return buildPageMetadata({ locale, page: 'home' });
}

export default async function RootLayout({ children }) {
  const locale = await getServerLocale();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <Providers initialLocale={locale}>
          <GlobalCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
