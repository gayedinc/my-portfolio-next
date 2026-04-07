import './globals.css';
import { Providers } from './providers';
import GlobalCursor from '../components/GlobalCursor';

export const metadata = {
  title: 'My Portfolio',
  description: 'Created with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning>
        <Providers>
          <GlobalCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}