import { userTable } from "@/services/local/db.config";
import { loginModel } from "@/services/local/yupModels";
import { Button, Input } from "@/ui";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";

export function LoginForm() {
	const router = useRouter();

	const { getFieldProps, handleSubmit, errors, touched } = useFormik({
		initialValues: loginModel.initials,
		validationSchema: loginModel.schema,
		onSubmit: async (values) => {
			try {
				const user = await userTable.get({
					email: values.email,
					password: values.password,
				});
				if (!user) throw new Error("User not found");
				console.log(user);
				router.push("/login");
			} catch (error) {
				console.log(error);
			}
		},
	});
	return (
		<form
			onSubmit={handleSubmit}
			className="mx-auto max-w-md h-full flex gap-7 flex-col justify-center">
			<div className="flex flex-col gap-2 items-center">
				<Link href="/">
					<h1 className="font-bold text-center">Desplash</h1>
				</Link>
				<h1 className="font-bold text-center">Login</h1>
				<p className="text-md text-center">Welcome Back</p>
			</div>

			<Input
				id="email-login"
				label="Email"
				type="email"
				placeholder="Enter your email"
				inputClass="py-2 border-primary-secondary focus:border-primary-main"
				labelClass="text-md"
				{...getFieldProps("email")}
				error={errors.email}
				touched={touched.email}
			/>
			<Input
				id="password-login"
				label="Password"
				type="password"
				placeholder="Enter your password"
				inputClass="py-2 border-primary-secondary focus:border-primary-main"
				labelClass="text-md"
				{...getFieldProps("password")}
				error={errors.password}
				touched={touched.password}
			/>
			<Button type="submit" className="!max-w-none bg-primary-main !text-white">
				Login
			</Button>

			<div className="py-7 border">
				<p className="text-md text-center">
					Don't have an account?{" "}
					<Link href="/join" className="underline link-default">
						Join Desplash
					</Link>
				</p>
			</div>
		</form>
	);
}
