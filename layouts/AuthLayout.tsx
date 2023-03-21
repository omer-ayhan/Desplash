import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { userAtom } from "@/services/local/store";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const user = useAtomValue(userAtom);

	useEffect(() => {
		if (!user && !user?.uid) {
			router.push("/login");
		}
	}, []);

	return <>{children}</>;
}
