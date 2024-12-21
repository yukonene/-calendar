import { FirebaseUserProvider } from '@/conponents/common/FirebaseUserProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseUserProvider>
      {/* api以外全てのコンポーネントで使えるもの */}
      <Component {...pageProps} />
    </FirebaseUserProvider>
  );
}
