

import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

type AppPropsWithSession = AppProps & {
    pageProps: AppProps['pageProps'] & {
        session: Session | null;
    };
};

export default function MyApp({ Component, pageProps }: AppPropsWithSession) {
    const { session, ...rest } = pageProps;

    return (
        <SessionProvider session={session}>
            <Component {...rest} />
        </SessionProvider>
    );
}
