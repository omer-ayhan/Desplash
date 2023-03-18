import Link from "next/link";
import React from "react";
import { Divider } from "./Divider";

export function Footer() {
	return (
		<div className="w-screen p-5 px-20">
			<Divider className="my-3" />
			<div className="flex justify-between">
				<Link href="/" className="text-xl font-bold">
					Desplash
				</Link>

				<p className="text-sm text-gray-500">
					© 2023 Desplash. All rights reserved. Made with{" "}
					<span className="text-red-500">❤</span>
				</p>
			</div>
		</div>
	);
}
