import "@/styles/globals.css";
import "react-responsive-modal/styles.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

import { MainLayout } from "@/layouts";
import { createStore, Provider } from "jotai";

export default function App({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				refetchOnMount: false,
				refetchOnReconnect: false,
				retry: false,
				retryOnMount: false,
			},
		},
	});

	const jotaiStore = createStore();

	return (
		<>
			<Head>
				<title>Best Free Photos & Images | Desplash</title>
			</Head>
			<QueryClientProvider client={queryClient}>
				<Provider store={jotaiStore}>
					<MainLayout>
						<Component {...pageProps} />
					</MainLayout>
				</Provider>
			</QueryClientProvider>
		</>
	);
}
