import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import React from "react";

export function MainLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<>
			<Navbar />
			<div className="pt-20">{children}</div>
			<Footer />
		</>
	);
}