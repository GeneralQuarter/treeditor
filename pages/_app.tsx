import { UserProvider } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import { useRef } from 'react';
import theme from '@treeditor/styles/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@treeditor/styles/create-emotion-cache';

import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@treeditor/styles/global.scss';

const clientSideEmotionCache = createEmotionCache();

function TreeditorApp({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
  const { user } = pageProps;

  const queryClientRef = useRef<QueryClient>()

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Treeditor</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider user={user}>
          <QueryClientProvider client={queryClientRef.current}>
            <Hydrate state={pageProps.dehydratedState}>
              <Component {...pageProps} />
            </Hydrate>
          </QueryClientProvider>
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default TreeditorApp
