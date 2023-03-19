import axios from "axios";

import { PhotoDetailType, PhotoType } from "@/types/photos";

import { PhotoDetail } from "@/components/PhotoDetail";
import { GetServerSidePropsContext } from "next";
import { RelatedPhotos } from "@/components/RelatedPhotos";
import { useRouter } from "next/router";
import Head from "next/head";

interface PhotoDetailPageProps {
	details: PhotoDetailType;
	related: {
		total: number;
		photos: PhotoType[];
	};
}

export default function PhotoDetailPage({
	details,
	related,
}: PhotoDetailPageProps) {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>
					{details.alt_description ||
						details.description ||
						"Best Free Photos & Images | Desplash"}
				</title>
			</Head>
			<div className="pt-1">
				<PhotoDetail id={details.id} placeholderData={details} noFetch>
					<RelatedPhotos
						id={details.id}
						onPhotoClick={(photo) => {
							router.push(`/photos/${photo.id}`);
						}}
						placeholderData={related}
						noFetch
					/>
				</PhotoDetail>
			</div>
		</>
	);
}

export async function getServerSideProps({
	params,
}: GetServerSidePropsContext) {
	const { id } = params as { id: string };

	const { data: details } = await axios.get(
		`https://unsplash.com/napi/photos/${id}`
	);

	const { data: related } = await axios.get(
		`https://unsplash.com/napi/photos/${id}/related`
	);

	return {
		props: {
			details,
			related: {
				total: related.total,
				photos: related.results,
			},
		},
	};
}
