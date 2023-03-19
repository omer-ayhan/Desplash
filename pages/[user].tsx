import { Divider } from "@/components/Divider";
import { Select } from "@/components/Forms";
import { UserDetailType } from "@/types/user";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineLink } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";

interface ProfilePageProps {
	userDetails: UserDetailType;
}

export default function ProfilePage({ userDetails }: ProfilePageProps) {
	const router = useRouter();

	console.log(userDetails);

	return (
		<>
			<Head>
				<title>
					{`${userDetails.name} (@${userDetails.username}) • Desplash Community`}
				</title>
			</Head>
			<div className="mt-[20%] md:mt-[10%] mx-auto max-w-2xl flex flex-col md:flex-row items-center  md:items-start gap-4">
				<Image
					className="rounded-full"
					src={`${userDetails.profile_image.large}&dpr=2&auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff`}
					width={150}
					height={150}
					alt={userDetails.name || userDetails.username}
					quality={100}
				/>
				<div className="flex flex-col gap-3">
					<h1 className="text-3xl font-bold">{userDetails.name}</h1>
					<p className="text-md my-2">{userDetails.bio}</p>
					<p className="text-md text-primary-secondary flex gap-1 items-center">
						<HiOutlineLocationMarker className="inline-block" />
						{userDetails.location}
					</p>

					<Select
						iconStart={<AiOutlineLink className="inline-block" />}
						options={[
							{
								label: "Followers",
								value: "followers",
							},
							{
								label: "Following",
								value: "following",
							},
						]}
					/>

					<p className="text-md">Interests</p>

					<div className="flex gap-2 flex-wrap items-center">
						{userDetails.tags.custom.map(({ title }) => (
							<Link
								href={`/s/photos/${title}`}
								className="px-2 py-1 capitalize text-primary-secondary text-md lg:text-sm bg-gray-200 hover:bg-gray-300 hover:text-primary-main transition-default">
								{title}
							</Link>
						))}
					</div>
				</div>
			</div>

			<Divider />
		</>
	);
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
	const { user } = query as { user: string };

	const { data: userDetails } = await axios.get(
		`https://unsplash.com/napi/users/${user.replace("@", "")}`
	);

	return {
		props: {
			userDetails,
		},
	};
}
