import { USERNAME_MIN_LENGTH } from "$env/static/private";
import { sql, getTursoRow } from "./db";
import { getDate } from "$lib/utils";
import Option from '../option';
import crypto from 'crypto-js';

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Option<import("$lib/models").User>>} 
 */
export async function get_user(username, password) {
	const saltRow = await getTursoRow(
		sql(`SELECT salt from users WHERE username = ? LIMIT 1;`),
		username
	);
	if (saltRow.isNone()) {
		return Option.none();
	}

	const { salt } = /** @type {{ salt: string }} */
		(saltRow.unwrap());
	const hash = crypto.SHA256(salt + password).toString();

	const userRow = await getTursoRow(sql(`
		SELECT user_id, username as un FROM users WHERE username = ? AND hash = ?;
	`), username, hash);
	if (userRow.isNone()) {
		return Option.none();
	}

	const { user_id, un } = /** @type {{user_id: number, un: string}} */
		(userRow.unwrap());
	return Option.some({
		userId: user_id,
		username: un,
	});
}


/**
 * @param {string} sessionId
 * @returns {Promise<Option<import("$lib/models").User>>} 
 */
export async function get_user_by_session(sessionId) {
	// TODO: should there be an expiration here?
	const sessionRow = await getTursoRow(sql(`
		SELECT user_id, username FROM sessions 
			JOIN users USING(user_id)
			WHERE expires_at >? AND session_id =?
			LIMIT 1;
	`), getDate().toISOString(), sessionId);
	if (sessionRow.isNone()) {
		return Option.none();
	}

	const { user_id, username } = /** @type {{user_id: number, username: string}} */
		(sessionRow.unwrap());
	const user = {
		userId: user_id,
		username: username,
	};
	return Option.some(user);
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Option<import('$lib/models').User>>} Newly created user
 */
export async function create_user(username, password) {
	// TODO: maybe a password tester too?
	if (username < USERNAME_MIN_LENGTH) {
		return Option.none();
	}

	const salt = crypto.lib.WordArray.random(128 / 8).toString();
	const hash = crypto.SHA256(salt + password).toString();

	const userIdRow = await getTursoRow(sql(`
		INSERT INTO users (username, hash, salt) 
			VALUES (?, ?, ?) 
			RETURNING user_id;
	`), username, hash, salt);


	const { user_id } = /** @type {{ user_id: number }} */
		(userIdRow.unwrap());
	const user = {
		userId: user_id,
		username
	}

	return Option.some(user);
}

