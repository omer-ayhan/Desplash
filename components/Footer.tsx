import Link from "next/link";
import React from "react";
import { Divider } from "../ui/Divider";

export function Footer() {
	return (
		<div className="w-screen py-5 px-8 md:px-20">
			<Divider className="my-3" />
			<div className="flex gap-3 flex-col md:flex-row justify-between">
				<Link href="/" className="text-xl text-center font-bold">
					Desplash
				</Link>

				<p className="text-sm text-center text-gray-500">
					© 2023 Desplash. All rights reserved. Made with{" "}
					<span className="text-red-500">❤</span>
				</p>
			</div>
		</div>
	);
}
