import { SESSION_ID_LENGTH } from "$env/static/private";
import { getExpiration } from "$lib/utils";
import Option from "../option";
import { sql, db, getRow } from "./db";
import crypto from 'crypto';

/**
 * @param {number} userId
 * @returns {Option<import("$lib/models").Session>}
 */
export function create_session(userId) {
	if (userId < 0) {
		return Option.none();
	}

	const sessionId = crypto.randomBytes(Number(SESSION_ID_LENGTH)).toString('hex');
	const expiresAt = getExpiration();
	const query = sql(`
		INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?) RETURNING session_id;
	`);
	const statement = db.prepare(query);
	const row = getRow(statement, sessionId, userId, expiresAt.toISOString());

	/** @type {{ session_id: string }} */
	const { session_id } = row.unwrap();
	const session = {
		sessionId: session_id,
		userId,
	}

	return Option.some(session);
}
