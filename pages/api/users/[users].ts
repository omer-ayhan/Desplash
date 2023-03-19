import { UserDetailType } from "@/types/user";
import axios, { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserDetailType | AxiosError>
) {
	const { method } = req;

	const { user } = req.query;

	switch (method) {
		case "GET":
			try {
				const { data, headers } = await axios.get(
					`https://unsplash.com/napi/users/${user}`
				);

				res.status(200).json(data);
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
