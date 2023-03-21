import { IUser } from "@/types/db";
import { PhotoType } from "@/types/photos";
import Dexie from "dexie";

const db = new Dexie("desplash");

db.version(1).stores({
	user: "++id, first_name, last_name, email, username, password",
	favorites:
		"++id, uid, created_at, updated_at, width, height, color, description, alt_description, urls, links, user",
});

export const userTable = db.table<IUser>("user");

export const favoritesTable = db.table<
	PhotoType & {
		uid: string;
	}
>("favorites");

export default db;
