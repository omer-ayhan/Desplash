export type Primitives = string | number | boolean;

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Primitives ? T[P] : DeepPartial<T[P]>;
};
