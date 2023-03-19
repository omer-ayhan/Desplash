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
		  }
		| AxiosError
	>
) {
	const { method } = req;

	const { per_page, page, user } = req.query;

	switch (method) {
		case "GET":
			try {
				const { data: photos, headers } = await axios.get(
					`https://unsplash.com/napi/users/${user}/photos?per_page=${per_page}&page=${page}&xp=search-quality-boosting%3Acontrol`
				);

				const linkHeader = headers.link;
				const hasNextLink = linkHeader?.includes('rel="next"');
				const pageParam = Number(page);

				res.status(200).json({
					photos,
					nextId: hasNextLink ? pageParam + 1 : null,
					prevId: pageParam > 1 ? pageParam - 1 : pageParam === 1 ? 1 : null,
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
