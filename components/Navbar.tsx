import axios from "axios";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { MdFavorite } from "react-icons/md";
import { useQuery } from "react-query";

import { userAtom } from "@/services/local/store";

import { Divider, Popover, Input, Avatar } from "@/ui";

const routesToHide = ["/u/[user]", "/photos/[id]"];

export function Navbar() {
	const router = useRouter();

	const [user, setUser] = useAtom(userAtom);

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

	const signOut = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<nav className="w-screen bg-white flex flex-col sticky top-0 z-50">
			<div className="p-3 px-5 flex gap-5 items-center">
				<Link href="/" className="text-xl font-bold">
					Desplash
				</Link>

				<Input
					id="navbar"
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
				{user?.uid ? (
					<>
						<Link
							href="/favorites"
							className="p-2 border border-gray-300 hover:border-primary-main text-primary-secondary hover:text-primary-main transition-default rounded-full"
							title="Your favorites">
							<MdFavorite size={20} />
						</Link>
						<Popover
							buttonClass="!py-0 !pl-0 h-full rounded-l-none transition-default"
							popoverClass="w-60 right-0 !top-14 py-1 rounded-md shadow-md"
							iconStart={<Avatar alt={user.first_name || user.username} />}>
							<ul className="flex flex-col py-2">
								<li className="p-3 py-3 text-primary-secondary hover:bg-gray-200 hover:text-black transition-default cursor-pointer">
									<Link href="/u/edit-profile" className="text-inherit text-sm">
										Edit profile
									</Link>
								</li>
								<Divider className="my-2" />
								<li
									onClick={signOut}
									className="p-3 py-3 text-sm text-primary-secondary hover:bg-gray-200 hover:text-black transition-default cursor-pointer">
									Log out @{user.username}
								</li>
							</ul>
						</Popover>
					</>
				) : (
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
								href="/join"
								className=" text-primary-secondary hover:text-black transition-default">
								Join Desplash
							</Link>
						</li>
					</ul>
				)}
			</div>
			{status === "success" && !routesToHide.includes(router.pathname) && (
				<ul className="relative p-3 py-4 flex gap-5 items-center overflow-y-hidden overflow-x-scroll scrollbar-hide">
					{topics.slice(0, 10).map(({ id, slug, title }) => (
						<li key={id}>
							<Link
								href={`/topics/${slug}`}
								className="text-sm font-medium text-primary-secondary hover:text-black transition-default whitespace-nowrap">
								{title}
							</Link>
						</li>
					))}
				</ul>
			)}
		</nav>
	);
}
