import { IUser } from "@/types/db";
import { atom, SetStateAction } from "jotai";
import { atomWithReducer, atomWithStorage } from "jotai/utils";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

type IUserStore = Omit<IUser, "password">;

type ActionType<T> = {
	type: string;
	payload: T;
};

interface initialState {
	user?: IUserStore | null;
	loginModal: {
		isOpen: boolean;
		img?: string;
	};
}

interface StoreType extends initialState {
	setUser: (user: IUserStore) => void;
	setLoginModal: (modalState: initialState["loginModal"]) => void;
	signOut: () => void;
}

const emptyState: StoreType = {
	user: null,
	loginModal: {
		isOpen: false,
		img: undefined,
	},
	setLoginModal: () => {
		return;
	},
	setUser: () => {
		return;
	},
	signOut: () => {
		return;
	},
};

const isSSR = typeof window === "undefined";

export const userAtom = atomWithReducer(
	!isSSR && JSON.parse(localStorage.getItem("user") || "null"),
	(draft, action: ActionType<IUserStore>) => {
		switch (action.type) {
			case "SET_USER":
				localStorage.setItem("user", JSON.stringify(action.payload));
				return action.payload;
			case "SIGN_OUT":
				localStorage.removeItem("user");
				return null;
			default:
				return draft;
		}
	}
);

export const modalAtom = atomWithReducer(
	{
		isOpen: false,
		img: "",
	},
	(
		draft,
		action: ActionType<{
			isOpen: boolean;
			img: string;
		}>
	) => {
		switch (action.type) {
			case "SET_MODAL":
				return action.payload;
			default:
				return draft;
		}
	}
);

// export const loginModalAtom = atom<{
// 	isOpen: boolean;
// 	img?: string;
// }>({
// 	isOpen: false,
// 	img: undefined,
// });

// export const setLoginModal = atom(null, (_get, set, str: any) =>
// 	set(loginModalAtom, str)
// );

const usePersistedStore = create<StoreType>()(
	devtools(
		persist(
			(set) => ({
				...emptyState,
				setUser: (user: IUserStore) => set({ user }),
				setLoginModal: (modalState: initialState["loginModal"]) =>
					set((prevState: initialState) => ({
						loginModal: {
							...prevState.loginModal,
							...modalState,
						},
					})),

				signOut: () => set({ user: null }),
			}),
			{
				name: "main-store",
				storage: createJSONStorage(() => localStorage),
			}
		)
	)
);

export const useMainStore = ((selector, compare) => {
	const store = usePersistedStore(selector, compare);
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => setHydrated(isSSR), []);

	return hydrated ? store : selector(emptyState);
}) as typeof usePersistedStore;
