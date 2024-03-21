import { create_session } from '$lib/db/session';
import { get_user } from '$lib/db/user';
import { getUser, isNullOrEmpty, setSession } from '$lib/utils';
import { redirect } from '@sveltejs/kit';


/** @type {import('./$types').PageServerLoad} */
export function load({ cookies }) {
	const user = getUser(cookies);
	if (user.isSome()) {
		throw redirect(303, '/');
	} else {
		// if there is session but it doesn't exist in the db, clear it
		cookies.delete('session', { path: '/' });
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		const data = Object.fromEntries(await request.formData());
		const { username, password } = data;

		if (isNullOrEmpty(username?.toString()) || isNullOrEmpty(password?.toString())) {
			return {
				status: 400,
				body: {
					success: false
				}
			}
		}

		const user = get_user(username.toString(), password.toString());
		if (user.isNone()) {
			return {
				status: 400,
				body: {
					success: false
				}
			}
		}

		const { userId } = user.unwrap();
		const newSession = create_session(userId);
		if (newSession.isSome()) {
			const { sessionId } = newSession.unwrap();
			setSession(cookies, sessionId);
			throw redirect(303, '/');
		}

		// something went wrong
		return {
			status: 500,
			body: {
				success: false
			}
		}
	}
}
