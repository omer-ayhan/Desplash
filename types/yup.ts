import { loginModel, registerModel } from "@/services/local/yupModels";

export type LoginFormType = typeof loginModel.initials;

export type RegisterFormType = typeof registerModel.initials;
