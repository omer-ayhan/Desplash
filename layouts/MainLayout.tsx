import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Image from "next/image";
import Modal from "react-responsive-modal";
import { useAtom, useAtomValue } from "jotai";

import { privateRoutes } from "@/constants";
import { loginModalAtom, userAtom } from "@/services/local/store";

import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";

const Navbar = dynamic(
	() => import("../components/Navbar").then((mod) => mod.Navbar),
	{
		ssr: false,
	}
);

export function MainLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	const router = useRouter();

	const user = useAtomValue(userAtom);
	const [loginModal, setLoginModal] = useAtom(loginModalAtom);

	return (
		<main>
			{!privateRoutes.includes(router.pathname) && <Navbar />}
			{children}
			{!privateRoutes.includes(router.pathname) && <Footer />}
			{!user?.uid && (
				<Modal
					classNames={{
						modal:
							"!p-0 relative overflow-x-hidden !overflow-y-auto !w-screen md:!max-w-3xl lg:!max-w-4xl rounded-md",
						closeButton: "hidden",
						closeIcon: "hidden",
					}}
					open={loginModal.isOpen}
					onClose={() =>
						setLoginModal({
							isOpen: false,
							img: "",
						})
					}>
					<div className="grid grid-cols-[300px_minmax(0,1fr)]">
						<div className="relative">
							{loginModal.img ? (
								<Image
									src={loginModal.img}
									fill
									alt="Login to like"
									className="object-cover"
								/>
							) : (
								<div className=" bg-primary-secondary w-full h-full"></div>
							)}
						</div>
						<div className="py-10">
							<LoginForm />
						</div>
					</div>
				</Modal>
			)}
		</main>
	);
}
