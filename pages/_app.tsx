import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

import { MainLayout } from "@/layouts";
import { createStore, Provider } from "jotai";
import { ToastContainer } from "react-toastify";

export const queryClient = new QueryClient({
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
export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Best Free Photos & Images | Desplash</title>
			</Head>

			<ToastContainer
				position="top-left"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<QueryClientProvider client={queryClient}>
				<Provider>
					<MainLayout>
						<Component {...pageProps} />
					</MainLayout>
				</Provider>
			</QueryClientProvider>
		</>
	);
}
