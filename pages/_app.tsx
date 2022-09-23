import 'antd/dist/antd.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { FirebaseProvider } from 'components/firebase-provider';
import { DraftGroupProvider } from 'components/draft-group-provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <DraftGroupProvider>
        <Component {...pageProps} />
      </DraftGroupProvider>
    </FirebaseProvider>
  )
}

export default MyApp
