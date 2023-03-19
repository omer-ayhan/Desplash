import { PhotoType } from "@/types/photos";
import axios from "axios";
import { useQuery } from "react-query";
import { ImageButton } from "./ImageButton";

interface RelatedPhotosProps {
	id: string;
	onPhotoClick: (photo: PhotoType) => void;
}

export function RelatedPhotos({ id, onPhotoClick }: RelatedPhotosProps) {
	const { data: related, status } = useQuery(
		`related-photos-${id}`,
		async () => {
			const { data } = await axios.get<{
				total: number;
				photos: PhotoType[];
			}>(`/api/photos/${id}/related`);
			return data;
		}
	);

	return (
		<div className="px-3 md:px-6 mx-auto lg:w-[85%] xl:w-[80%]">
			<h4 className="mb-4">Related Photos</h4>
			<div className="w-full masonry-col-2 masonry-gap-2 lg:masonry-col-3 lg:masonry-gap-4">
				{status === "success" &&
					related.photos.map((data) => (
						<ImageButton
							key={data.id}
							className="mb-2 lg:mb-4"
							data={data}
							onClick={() => onPhotoClick(data)}
							width={500}
						/>
					))}
			</div>
		</div>
	);
}
