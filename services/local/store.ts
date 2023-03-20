import { IUser } from "@/types/db";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

type IUserStore = Omit<IUser, "password">;

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
			}
		)
	)
);

export const useMainStore = ((selector, compare) => {
	const store = usePersistedStore(selector, compare);
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => setHydrated(true), []);

	return hydrated ? store : selector(emptyState);
}) as typeof usePersistedStore;
