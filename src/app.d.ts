// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: { userId: number, username: string }
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	module 'option' {
		declare class Option<T> {
			private constructor(value: T);
			static some(value: T): Option<T>;
			static none(): Option<T>;

			isNone(): boolean;
			isSome(): boolean;
			unwrap(): T;
			unwrapOr(defaultValue: T): T;
		}
	}
}

export { };
