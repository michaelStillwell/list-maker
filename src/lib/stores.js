import { DB_CONNTECTION } from '$env/static/private';
import knex from 'knex';
import { writable } from 'svelte/store';

export const db = knex({
	client: 'sqlite3',
	connection: {
		filename: DB_CONNTECTION
	}
});

/** @type {import('svelte/store').Writable<import('$lib/models').User?>} */
export const user = writable(null);
