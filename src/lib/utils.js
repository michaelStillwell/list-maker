import { SESSION_EXPIRATION_MINUTES } from "$env/static/private";
import { get_user_by_session } from "./db/user";
import Option from './option';

/**
 * @param {string|undefined|null} val
 * @returns bool
*/
export function isNullOrEmpty(val) {
	return typeof val !== 'string' || !val.length;
}

/**
 * @param {import("@sveltejs/kit").Cookies} cookies 
 * @returns {Promise<Option<import("$lib/models").User>>}
 */
export async function getUser(cookies) {
	const session = cookies.get('session');
	if (!session) {
		return Option.none();
	}

	const user = get_user_by_session(session);
	return user;
}

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {string} sessionId
 * @returns {void}
 */
export function setSession(cookies, sessionId) {
	cookies.set('session', sessionId, { path: '/', expires: getExpiration() });
}


/**
 * @returns {Date}
 */
export function getDate() {
	const date = new Date();
	return date;
}

/**
 * @returns {Date}
 */
export function getExpiration() {
	const date = new Date();
	const expires = new Date(date.getTime() + Number(SESSION_EXPIRATION_MINUTES) * 60000);
	return expires;
}
