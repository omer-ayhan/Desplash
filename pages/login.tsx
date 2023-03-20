import Head from "next/head";

import { LoginForm } from "@/components/LoginForm";

export default function Login() {
	return (
		<>
			<Head>
				<title>Login | Desplash</title>
			</Head>
			<div className="h-screen">
				<LoginForm className="max-w-md" />
			</div>
		</>
	);
}
