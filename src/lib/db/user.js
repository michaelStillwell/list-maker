import { db, sql, getRow } from "./db";
import Option from '../option';
import { getDate } from "$lib/utils";
import { USERNAME_MIN_LENGTH } from "$env/static/private";
import crypto from 'crypto-js';

/**
 * @param {string} username
 * @param {string} password
 * @returns {Option<import("$lib/models").User>} 
 */
export function get_user(username, password) {
	const saltQuery = sql(`
		SELECT salt FROM users WHERE username = ?;
	`);
	const saltStatment = db.prepare(saltQuery);
	const saltRow = getRow(saltStatment, username);
	if (saltRow.isNone()) {
		return Option.none();
	}

	/** @type {{ salt: string }} */
	const { salt } = saltRow.unwrap();
	const hash = crypto.SHA256(salt + password).toString();

	const query = sql(`
		SELECT user_id, username as un FROM users WHERE username = ? AND hash = ?;
	`);
	const statment = db.prepare(query);
	const row = getRow(statment, username, hash);
	if (row.isNone()) {
		return Option.none();
	}

	/** @type {{user_id: number, un: string}} */
	const { user_id, un } = row.unwrap();
	return Option.some({
		userId: user_id,
		username: un,
	});
}


/**
 * @param {string} sessionId
 * @returns {Option<import("$lib/models").User>} 
 */
export function get_user_by_session(sessionId) {
	// TODO: should there be an expiration here?
	const query = sql(`
		SELECT user_id, username FROM sessions 
			JOIN users USING(user_id)
			WHERE expires_at >? AND session_id =?
			LIMIT 1;
	`);

	const statement = db.prepare(query);
	const row = getRow(statement, getDate().toISOString(), sessionId);
	if (row.isNone()) {
		return Option.none();
	}

	/** @type {{user_id: number, username: string}} */
	const { user_id, username } = row.unwrap();
	const user = {
		userId: user_id,
		username: username,
	};
	return Option.some(user);
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {Option<import('$lib/models').User>} Newly created user
 */
export function create_user(username, password) {
	// TODO: maybe a password tester too?
	if (username < USERNAME_MIN_LENGTH) {
		return Option.none();
	}

	const salt = crypto.lib.WordArray.random(128 / 8).toString();
	const hash = crypto.SHA256(salt + password).toString();

	const query = sql(`
		INSERT INTO users (username, hash, salt) 
			VALUES (?, ?, ?) 
			RETURNING user_id;
	`);
	const statement = db.prepare(query);
	const row = getRow(statement, username, hash, salt);

	/** @type {{ user_id: number }} */
	const { user_id } = row.unwrap();
	const user = {
		userId: user_id,
		username
	}

	return Option.some(user);
}

