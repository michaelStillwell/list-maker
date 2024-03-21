import { DB_CONNTECTION } from '$env/static/private';
import Database from 'better-sqlite3';
import Option from '../option';

export const db = Database(DB_CONNTECTION); //, { verbose: console.log });

/**
 * @param {string} query
 * @returns {string}
 */
export function sql(query) {
	return query.trim();
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
