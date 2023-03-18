import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { Input } from "./Forms";

const cats = Array.from({ length: 15 }, (_, i) => i + 1);

export function Navbar() {
	return (
		<nav className="w-screen bg-white flex flex-col  fixed top-0">
			<div className="p-3 flex gap-5 items-center">
				<Link href="/" className="text-xl font-bold">
					Desplash
				</Link>

				<Input
					className="flex-1"
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
			<ul className="p-3 flex gap-5 items-center">
				{cats.map((cat) => (
					<li key={cat}>
						<Link
							href={`/category/${cat}`}
							className="text-sm font-medium text-primary-secondary hover:text-black transition-default">
							Category {cat}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
