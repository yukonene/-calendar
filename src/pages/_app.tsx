import { FirebaseUserProvider } from '@/providers/FirebaseUserProvider';
import Layout from '@/components/layouts/Layout';
import { ResponsiveProvider } from '@/providers/ResponsiveProvider';
import { SnackbarProvider } from '@/providers/SnackbarProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseUserProvider>
      <ResponsiveProvider>
        <SnackbarProvider>
          <Layout>
            {/* api以外全てのコンポーネントで使えるもの */}
            <Component {...pageProps} />
          </Layout>
        </SnackbarProvider>
      </ResponsiveProvider>
    </FirebaseUserProvider>
  );
}
