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
