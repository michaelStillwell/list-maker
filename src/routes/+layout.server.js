import { getUser } from "$lib/utils";

// TODO: not sure why this is complaining?
// @ts-ignore
/** @type {import('./$types').PageServerLoad} */
// @ts-ignore
export function load({ cookies }) {
	const user = getUser(cookies);

	return {
		user: user.isSome() ? user.unwrap() : null
	};
}
