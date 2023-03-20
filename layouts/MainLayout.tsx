import React from "react";
import { useRouter } from "next/router";
import Modal from "react-responsive-modal";

import { privateRoutes } from "@/constants";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useMainStore } from "@/services/local/store";
import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";

export function MainLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	const router = useRouter();
	const { user, loginModal, setLoginModal } = useMainStore((state) => ({
		user: state.user,
		loginModal: state.loginModal,
		setLoginModal: state.setLoginModal,
	}));

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
