import { goto } from '$app/navigation';
import { create_session } from '$lib/db/session';
import { create_user } from '$lib/db/user';
import { getUser, isNullOrEmpty, setSession } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import Option from '$lib/option';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const user = await getUser(cookies);
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

		let user = Option.none();
		try {
			user = await create_user(username.toString(), password.toString());
			if (user.isNone()) {
				return { status: 400 };
			}
		} catch (e) {
			return {
				status: 400,
				msg: 'Username exists'
			};
		}

		const { userId } = user.unwrap();
		const newSession = await create_session(userId);
		if (newSession.isSome()) {
			const { sessionId } = newSession.unwrap();
			setSession(cookies, sessionId);
			throw redirect(307, '/');
		}

		return {
			status: 500
		};
	}
};
