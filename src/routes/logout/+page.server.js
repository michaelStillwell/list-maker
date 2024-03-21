import { user } from '$lib/stores';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load({ cookies  }) {
	cookies.delete('session', { path: '/' });
	user.set(null);
	throw redirect(303, '/login');
}

