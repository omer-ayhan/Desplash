import { favoritesTable } from "@/services/local/db.config";
import { userAtom } from "@/services/local/store";
import { useAtom, useAtomValue } from "jotai";
import Head from "next/head";
import { useQuery } from "react-query";

export default function Favorites() {
	const user = useAtomValue(userAtom);
	const { data, refetch, error } = useQuery(
		"favorites",
		async () => {
			const db = await favoritesTable.where("uid").equals(user?.uid).toArray();

			return db;
		},
		{}
	);

	return (
		<>
			<Head>
				<title>Favorites</title>
			</Head>
			<section className="h-screen"></section>
		</>
	);
}
