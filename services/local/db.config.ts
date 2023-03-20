import { IUser } from "@/types/db";
import { PhotoType } from "@/types/photos";
import Dexie from "dexie";

const db = new Dexie("desplash");

db.version(1).stores({
	user: "++id, first_name, last_name, email, username, password",
	favorites: "++id",
});

export const userTable = db.table<IUser>("user");

export const favoritesTable = db.table<PhotoType>("favorites");

export default db;
