import Link from "next/link";
import { useRouter } from "next/router";
import { FormikHelpers, useFormik } from "formik";
import { useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { DexieError } from "dexie";

import { userTable } from "@/services/local/db.config";
import { userAtom } from "@/services/local/store";
import { loginModel } from "@/services/local/yupModels";
import { cn } from "@/services/local";
import { LoginFormType } from "@/types/yup";

import { Button, Input } from "@/ui";

export function LoginForm({ className }: { className?: string }) {
	const router = useRouter();
	const setUser = useSetAtom(userAtom);

	const handleLogin = async (
		values: LoginFormType,
		{ setSubmitting, resetForm }: FormikHelpers<LoginFormType>
	) => {
		setSubmitting(true);
		try {
			const user = await userTable.get(values);

			if (!user)
				throw {
					message: "User not found",
				};

			setUser({
				email: user.email,
				username: user.username,
				first_name: user.first_name,
				last_name: user.last_name,
				uid: user.uid,
			});
			localStorage.setItem("user", JSON.stringify(user));
			resetForm();
			toast.success("Login successful");
			router.push("/");
		} catch (error) {
			const err = error as DexieError;
			toast.error(err?.message);
		} finally {
			setSubmitting(false);
		}
	};

	const { getFieldProps, handleSubmit, errors, touched, isSubmitting } =
		useFormik({
			initialValues: loginModel.initials,
			validationSchema: loginModel.schema,
			onSubmit: handleLogin,
		});

	return (
		<form
			onSubmit={handleSubmit}
			className={cn(
				"px-5 mx-auto max-w-md h-full flex gap-7 flex-col justify-center",
				className
			)}>
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
			<Button
				type="submit"
				className="!max-w-none bg-primary-main !text-white"
				loading={isSubmitting}>
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
