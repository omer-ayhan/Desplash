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
		<div className="mx-auto w-[85%]">
			<h4 className="mb-4">Related Photos</h4>
			<div className="w-full masonry-col-3 masonry-gap-4">
				{status === "success" &&
					related.photos.map((data) => (
						<ImageButton
							key={data.id}
							className="mb-4"
							data={data}
							onClick={() => onPhotoClick(data)}
							width={500}
						/>
					))}
			</div>
		</div>
	);
}
