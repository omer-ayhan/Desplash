import { PhotoType } from "@/types/photos";
import axios, { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<
		| {
				photos: PhotoType[];
				nextId: number | null;
				prevId: number | null;
				meta: {
					keyword: string;
					title: string;
					description: null | string;
					index: boolean;
				};
		  }
		| AxiosError
	>
) {
	const { method } = req;

	const { q, per_page, page } = req.query;

	switch (method) {
		case "GET":
			try {
				const { data, headers } = await axios.get(
					`https://unsplash.com/napi/search?query=${q}&per_page=${per_page}&page=${page}&xp=search-quality-boosting%3Acontrol`
				);

				const linkHeader = headers.link;
				const hasNextLink = linkHeader?.includes('rel="next"');
				const pageParam = Number(page);

				res.status(200).json({
					photos: data.photos.results,
					nextId: hasNextLink ? pageParam + 1 : null,
					prevId: pageParam > 1 ? pageParam - 1 : pageParam === 1 ? 1 : null,
					meta: data.meta,
				});
			} catch (error) {
				const err = error as AxiosError;
				res.status(err.status || 500).json(err);
			}
			break;
		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
