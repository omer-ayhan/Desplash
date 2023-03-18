import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

import { MainLayout } from "@/layouts";

export default function App({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient();

	return (
		<>
			<Head>
				<title>Best Free Photos & Images | Desplash</title>
			</Head>
			<QueryClientProvider client={queryClient}>
				<MainLayout>
					<Component {...pageProps} />
				</MainLayout>
			</QueryClientProvider>
		</>
	);
}
