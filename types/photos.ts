export type PhotoType = {
	id: string;
	created_at: string;
	updated_at: string;
	promoted_at: string;
	width: number;
	height: number;
	color: string;
	blur_hash: string;
	description: null | string;
	alt_description: string;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
		small_s3: string;
	};
	links: {
		self: string;
		html: string;
		download: string;
		download_location: string;
	};
	likes: number;
	liked_by_user: boolean;
	current_user_collections: string[];
	sponsorship: string | null;
	user: UserType;
};

export type UserType = {
	id: string;
	updated_at: string;
	username: string;
	name: string;
	first_name: string;
	last_name: string;
	twitter_username: string;
	portfolio_url: null | string;
	bio: null | string;
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
	instagram_username: string;
	total_collections: string;
	total_likes: number;
	total_photos: number;
	accepted_tos: boolean;
	for_hire: boolean;
	social: {
		instagram_username: string;
		portfolio_url: string | null;
		twitter_username: string;
		paypal_email: string | null;
	};
};
