//import '../styles/globals.css'
//import type { AppProps } from 'next/app'

//function MyApp({ Component, pageProps }: //AppProps) {
  //return <Component {...pageProps} />
//}

//export default MyApp
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/generated-icon.png" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;