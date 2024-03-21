import { user } from '$lib/stores';
import { getUser } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

const publicPaths = [
	'/sign-up',
	'/test',
	'/login',
	'/logout',
];

/**
 * Verifies that the given path is allowed.
 *
 * @param {string} url
 */
function isAllowed(url) {
	return publicPaths.some(path =>
		path === url || url.startsWith(`${path}/`));
}

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url);
	if (isAllowed(url.pathname)) {
		const response = await resolve(event);
		return response;
	}

	const response = await resolve(event);
	const currUser = getUser(event.cookies);
	if (currUser.isNone()) {
		throw redirect(302, '/login');
	}
	user.set(currUser.unwrap());

	return response;
};
