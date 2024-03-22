import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "$env/static/private";
import { createClient } from "@libsql/client";
import Option from '../option';

export const turso = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN,
});

/**
 * @param {string} query
 * @returns {string}
 */
export function sql(query) {
	return query.trim();
}

/**
 * @param {string} sql
 * @param {any[]} args 
 * @returns {Promise<Option<unknown>>}
 */
export async function getTursoRow(sql, ...args) {
	// TODO: is there a way to make this a generic?
	try {
		const { rows } = await turso.execute({ sql, args: [...args] });
		if (rows !== undefined && rows !== null && rows.length >= 1) {
			return Option.some(rows[0]);
		}
		return Option.none();
	} catch (e) {
		console.log('getTursoRow#error', e);
		return Option.none();
	}
}

/**
 * @param {string} sql
 * @param {any[]} args 
 * @returns {Promise<Option<import('@libsql/client').Row[]>>}
 */
export async function getTursoRows(sql, ...args) {
	// TODO: is there a way to make this a generic?
	try {
		const { rows } = await turso.execute({ sql, args: [...args] });
		if (rows !== undefined && rows !== null && rows.length >= 1) {
			return Option.some(rows);
		}

		return Option.none();
	} catch (e) {
		console.log('getTursoRows#error', e);
		return Option.none();
	}
}

/**
 * @param {string} sql
 * @param {any[]} args 
 * @returns {Promise<Option<import('@libsql/client').ResultSet>>}
 */
export async function executeTurso(sql, ...args) {
	// TODO: is there a way to make this a generic?
	try {
		const response = await turso.execute({ sql, args: [...args] });
		return Option.some(response);
	} catch (e) {
		console.log('getTursoRows#error', e);
		return Option.none();
	}
}

/**
 * @template T
 * @param {*} statment 
 * @param {*} args 
 * @returns {Option<T>}
 */
export function getRow(statment, ...args) {
	const row = statment.get(...args);
	if (row !== undefined && row !== null) {
		return Option.some(row);
	}

	return Option.none();
}

/**
 * @template T
 * @param {*} statment 
 * @param {*} args 
 * @returns {Option<T>}
 */
export function allRows(statment, ...args) {
	const rows = statment.all(...args);
	if (rows !== undefined && rows !== null) {
		return Option.some(rows);
	}

	return Option.none();
}
