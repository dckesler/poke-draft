import 'antd/dist/antd.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { FirebaseProvider } from 'components/firebase-provider';
import { DraftGroupProvider } from 'components/draft-group-provider';
import {LoginProvider} from '@/components/login-provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <LoginProvider>
        <DraftGroupProvider>
          <Component {...pageProps} />
        </DraftGroupProvider>
      </LoginProvider>
    </FirebaseProvider>
  )
}

export default MyApp
