interface IOwner {
	id: string;
	updated_at: string;
	username: string;
	name: string;
	first_name: string;
	last_name: string | null;
	twitter_username: string | null;
	portfolio_url: string | null;
	bio: string;
	location: string;
	links: {
		self: string;
		html: string;
		photos: string;
		likes: string;
		portfolio: string;
		following: string;
		followers: string;
	};
	profile_image: {
		small: string;
		medium: string;
		large: string;
	};
	instagram_username: string | null;
	total_collections: number;
	total_likes: number;
	total_photos: number;
	accepted_tos: boolean;
	for_hire: boolean;
	social: {
		instagram_username: string | null;
		portfolio_url: string | null;
		twitter_username: string | null;
		paypal_email: string | null;
	};
}

interface IPhotoUrls {
	raw: string;
	full: string;
	regular: string;
	small: string;
	thumb: string;
	small_s3: string;
	medium_s3: string;
	large_s3: string;
	original_s3: string;
}

interface IPhoto {
	id: string;
	created_at: string;
	updated_at: string;
	promoted_at: string | null;
	width: number;
	height: number;
	color: string;
	blur_hash: string;
	description: string | null;
	alt_description: string | null;
	urls: IPhotoUrls;
	links: {
		self: string;
		html: string;
		download: string;
		download_location: string;
	};
	categories: any[];
	likes: number;
	liked_by_user: boolean;
	current_user_collections: any[];
	sponsorship: any;
	user: IOwner;
}

interface ILinks {
	self: string;
	html: string;
	photos: string;
}

export interface ITopic {
	id: string;
	slug: string;
	title: string;
	description: string;
	published_at: string;
	updated_at: string;
	starts_at: string;
	ends_at: string | null;
	only_submissions_after: string | null;
	visibility: string;
	featured: boolean;
	total_photos: number;
	current_user_contributions: any[];
	total_current_user_submissions: null | number;
	links: ILinks;
	status: string;
	owners: IOwner[];
	cover_photo: IPhoto;
}
export type TopicsType = {
	id: string;
	slug: string;
	title: string;
};
