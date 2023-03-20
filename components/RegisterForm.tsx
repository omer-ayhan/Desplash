import { useFormik } from "formik";
import Link from "next/link";

import { registerModel } from "@/services/local/yupModels";
import { userTable } from "@/services/local/db.config";

import { Button, Input } from "@/ui";
import { nanoid } from "nanoid";

export function RegisterForm() {
	const { getFieldProps, handleSubmit, errors, touched, isSubmitting } =
		useFormik({
			initialValues: registerModel.initials,
			validationSchema: registerModel.schema,
			onSubmit: async (values, { resetForm, setSubmitting }) => {
				setSubmitting(true);
				try {
					const emailExists = await userTable.get({
						email: values.email,
					});
					const userNameExists = await userTable.get({
						username: values.username,
					});
					if (emailExists)
						throw new Error("User with this email already exists");
					if (userNameExists)
						throw new Error("User with this username already exists");

					const id = await userTable.add({
						...values,
						uid: nanoid(),
					});

					console.info(`A new user has been added with id: ${id}`);
					resetForm();
				} catch (error) {
					console.error(error);
				} finally {
					setSubmitting(false);
				}
			},
		});
	return (
		<form
			onSubmit={handleSubmit}
			className="mx-auto max-w-2xl h-full flex gap-7 flex-col justify-center">
			<div className="flex flex-col gap-2 items-center">
				<h1 className="font-bold text-center text-5xl">Join Desplash</h1>
				<p className="text-md text-center">
					Already have an account?{" "}
					<Link href="/login" className="underline link-default">
						Login
					</Link>
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<Input
					id="first-name"
					label="First Name"
					className="col-span-2 md:col-span-1"
					inputClass="py-2 border-primary-secondary focus:border-primary-main"
					labelClass="text-md"
					{...getFieldProps("first_name")}
					error={errors.first_name}
					touched={touched.first_name}
				/>
				<Input
					id="last-name"
					label="Last Name"
					className="col-span-2 md:col-span-1"
					inputClass="py-2 border-primary-secondary focus:border-primary-main"
					labelClass="text-md"
					{...getFieldProps("last_name")}
					error={errors.last_name}
					touched={touched.last_name}
				/>
				<Input
					id="email-register"
					label="Email"
					type="email"
					className="col-span-2"
					inputClass="py-2 border-primary-secondary focus:border-primary-main"
					labelClass="text-md"
					{...getFieldProps("email")}
					error={errors.email}
					touched={touched.email}
				/>
				<Input
					id="username-register"
					label={
						<label className="text-md" htmlFor="username-register">
							Username{" "}
							<span className="text-sm text-primary-secondary">
								( only letters, numbers, and underscores )
							</span>
						</label>
					}
					className="col-span-2"
					inputClass="py-2 border-primary-secondary focus:border-primary-main"
					labelClass="text-md"
					{...getFieldProps("username")}
					error={errors.username}
					touched={touched.username}
				/>
				<Input
					id="password-register"
					label={
						<label htmlFor="password-register" className="text-md">
							Password{" "}
							<span className="text-sm text-primary-secondary">
								( min. 8 characters )
							</span>
						</label>
					}
					className="col-span-2"
					type="password"
					inputClass="py-2 border-primary-secondary focus:border-primary-main"
					labelClass="text-md"
					{...getFieldProps("password")}
					error={errors.password}
					touched={touched.password}
				/>
			</div>

			<Button
				type="submit"
				className="!max-w-none bg-primary-main !text-white"
				loading={isSubmitting}>
				Join
			</Button>

			<p className="text-center text-sm">
				By signing up, you agree to our{" "}
				<Link href="/terms" className="underline link-default text-sm">
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link href="/privacy" className="underline link-default text-sm">
					Privacy Policy
				</Link>
				.
			</p>
		</form>
	);
}
