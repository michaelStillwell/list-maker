import { getUser } from "$lib/utils";

/** @type {import("../$types").PageServerLoad} */
export function load({cookies}) {
	const user = getUser(cookies);
	if (user.isNone()){
		return {
			user: null
		};
	}

	return {
		user: user.unwrap()
	}
}
