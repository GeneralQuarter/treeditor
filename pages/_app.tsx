import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Head from 'next/head';
import { useEffect } from 'react';
import theme from '../theme';


function TreeditorApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

   return (
    <>
      <Head>
        <title>Treeditor</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default TreeditorApp
