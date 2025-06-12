'use client';

import React, { useEffect } from 'react';
import { ThemeProvider } from '../components/ThemeContext';
import { Toaster } from 'react-hot-toast';
import '../i18n';

export function Providers({ children }) {
  // React Strict Mode'da çift yüklemeyi önlemek için
  useEffect(() => {
    // i18n başlatılması client tarafında
  }, []);

  return (
    <ThemeProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {children}
    </ThemeProvider>
  );
}