import { TopicsType } from "@/types/topics";
import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<TopicsType[] | AxiosError>
) {
	switch (req.method) {
		case "GET":
			try {
				const { data } = await axios.get(`https://unsplash.com/napi/topics`);

				res.status(200).json(data);
			} catch (error) {
				const err = error as AxiosError;

				res
					.status(err.status || 500)
					.json(err || { message: "Something went wrong" });
			}
			break;

		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${req.method} Not Allowed`);
			break;
	}
}
