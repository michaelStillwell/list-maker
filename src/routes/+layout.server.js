import { getUser } from "$lib/utils";

/** @param {*} args */
export async function load({ cookies }) {
	const user = await getUser(cookies);

	return {
		user: user.isSome() ? user.unwrap() : null
	};
}
