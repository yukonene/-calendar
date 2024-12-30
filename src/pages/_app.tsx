import { FirebaseUserProvider } from '@/components/common/FirebaseUserProvider';
import { ResponsiveProvider } from '@/components/common/ResponsiveProvider';
import { SnackbarProvider } from '@/components/common/SnackbarProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseUserProvider>
      <ResponsiveProvider>
        <SnackbarProvider>
          {/* api以外全てのコンポーネントで使えるもの */}
          <Component {...pageProps} />
        </SnackbarProvider>
      </ResponsiveProvider>
    </FirebaseUserProvider>
  );
}
