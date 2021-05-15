import { UserProvider } from '@auth0/nextjs-auth0';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Head from 'next/head';
import { useEffect } from 'react';
import theme from '@treeditor/theme';

import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@treeditor/components/editor-map.scss';

function TreeditorApp({ Component, pageProps }) {
  const { user } = pageProps;

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
        <UserProvider user={user}>
          <Component {...pageProps} />
        </UserProvider>
      </ThemeProvider>
    </>
  );
}

export default TreeditorApp
