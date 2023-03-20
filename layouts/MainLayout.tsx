import React from "react";
import { useRouter } from "next/router";

import { privateRoutes } from "@/constants";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export function MainLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	const router = useRouter();
	return (
		<main>
			{!privateRoutes.includes(router.pathname) && <Navbar />}
			{children}
			{!privateRoutes.includes(router.pathname) && <Footer />}
		</main>
	);
}
