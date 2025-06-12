import './globals.css'; // Global CSS importu
import { Providers } from './providers';

export const metadata = {
  title: 'My Portfolio',
  description: 'Created with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}