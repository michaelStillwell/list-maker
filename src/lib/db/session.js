import { SESSION_ID_LENGTH } from "$env/static/private";
import { getExpiration } from "$lib/utils";
import { sql, getTursoRow } from "./db";
import Option from "../option";
import crypto from 'crypto';

/**
 * @param {number} userId
 * @returns {Promise<Option<import("$lib/models").Session>>}
 */
export async function create_session(userId) {
	if (userId < 0) {
		return Option.none();
	}

	const sessionId = crypto.randomBytes(Number(SESSION_ID_LENGTH)).toString('hex');
	const expiresAt = getExpiration();
	const sessionIdRow = await getTursoRow(sql(`
		INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?) RETURNING session_id;
	`), sessionId, userId, expiresAt.toISOString());


	const { session_id } = /** @type {{ session_id: string }} */
		(sessionIdRow.unwrap());
	const session = {
		sessionId: session_id,
		userId,
	}

	return Option.some(session);
}
