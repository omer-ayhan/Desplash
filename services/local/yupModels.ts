import * as yup from "yup";

export const loginModel = {
	initials: {
		email: "",
		password: "",
	},
	schema: yup.object().shape({
		email: yup.string().email().required(),
		password: yup.string().required(),
	}),
};

export const registerModel = {
	initials: {
		first_name: "",
		last_name: "",
		email: "",
		username: "",
		password: "",
	},
	schema: yup.object().shape({
		first_name: yup.string().required(),
		last_name: yup.string().required(),
		email: yup.string().email().required(),
		username: yup
			.string()
			.min(4, "Username is too short - should be 4 chars minimum.")
			.max(20, "Username is too long - should be 20 chars maximum.")
			.matches(
				/^[a-zA-Z0-9_]+$/,
				"Username can only contain Latin letters, numbers and underscores."
			)
			.required(),
		password: yup
			.string()
			.min(8, "Password is too short - should be 8 chars minimum.")
			.required(),
	}),
};
