import { IUser } from "@/types/db";
import { atom } from "jotai";

type IUserStore = Omit<IUser, "password">;

interface initialState {
	user?: IUserStore | null;
	loginModal: {
		isOpen: boolean;
		img?: string;
	};
}

const isSSR = typeof window === "undefined";

export const userAtom = atom(
	!isSSR && JSON.parse(localStorage.getItem("user") || "null")
);

export const loginModalAtom = atom<{
	isOpen: boolean;
	img?: string;
}>({
	isOpen: false,
	img: "",
});

export const userSignOut = atom(null, (get, set) => {
	localStorage.removeItem("user");
	set(userAtom, null);
});
