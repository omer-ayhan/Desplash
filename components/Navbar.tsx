import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";

import { Input } from "./Forms";

export function Navbar() {
	const router = useRouter();
	const { data: topics, status } = useQuery<
		{
			id: string;
			slug: string;
			title: string;
			description: string;
		}[]
	>("topics", async () => {
		const { data: resTopics } = await axios.get("/api/topics");

		return resTopics;
	});

	const [searchText, setSearchText] = useState<string>(
		router.query.search as string
	);

	return (
		<nav className="w-screen bg-white flex flex-col fixed top-0 z-50">
			<div className="p-3 px-5 flex gap-5 items-center">
				<Link href="/" className="text-xl font-bold">
					Desplash
				</Link>

				<Input
					className="flex-1"
					value={searchText}
					onChange={(e) => setSearchText(e.currentTarget.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							router.push(`/s/photos/${e.currentTarget.value}`);
						}
					}}
					icon={<AiOutlineSearch size={20} className="text-gray-500 " />}
					inputClass="!p-2 !px-4 placeholder:text-gray-500 text-main rounded-full bg-gray-200 focus:bg-white border-transparent hover:border-gray-300"
					placeholder="Search"
					type="text"
					name="search"
				/>
				<ul className="flex gap-2 items-center">
					<li>
						<Link
							href="/login"
							className="text-primary-secondary hover:text-black transition-default">
							Log in
						</Link>
					</li>
					<li>
						<span className="text-primary-secondary">/</span>
					</li>
					<li>
						<Link
							href="/signup"
							className=" text-primary-secondary hover:text-black transition-default">
							Sign up
						</Link>
					</li>
				</ul>
			</div>
			{status === "success" && (
				<ul className="relative p-3 py-4 flex gap-5 items-center overflow-y-hidden overflow-x-scroll scrollbar-hide">
					{topics.slice(0, 10).map(({ id, slug, title }) => (
						<li key={id}>
							<Link
								href={`/topics/${slug}`}
								className="text-sm font-medium text-primary-secondary hover:text-black transition-default">
								{title}
							</Link>
						</li>
					))}
				</ul>
			)}
		</nav>
	);
}
