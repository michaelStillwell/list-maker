import { goto } from '$app/navigation';
import { create_session } from '$lib/db/session';
import { create_user } from '$lib/db/user';
import { getUser, isNullOrEmpty, setSession } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import Option from '$lib/option';

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
		console.log('signing up');
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

		let user = Option.none();
		try {
			console.log('creating user');
			user = create_user(username.toString(), password.toString());
			if (user.isNone()) {
				return { status: 400 };
			}
		} catch (e) {
			console.log('erroring', e);
			return {
				status: 400,
				msg: 'Username exists'
			};
		}

		const { userId } = user.unwrap();
		console.log('creating session');
		const newSession = create_session(userId);
		if (newSession.isSome()) {
			console.log('setting cookie');
			const { sessionId } = newSession.unwrap();
			setSession(cookies, sessionId);
			throw redirect(307, '/');
		}
		console.log('setting cookie');

		return {
			status: 500
		};
	}
};
