import Head from "next/head";

export default function Favorites() {
	// const { data, refetch, error } = useQuery(
	// 	"favorites",
	// 	async () => {
	// 		return;
	// 		// const db = await favoritesTable
	// 		// 	.where("uid")
	// 		// 	.equals(currUser?.uid)
	// 		// 	.toArray();

	// 		// return db;
	// 	},
	// 	{}
	// );

	return (
		<>
			<Head>
				<title>Favorites</title>
			</Head>
			<section className="h-screen"></section>
		</>
	);
}
