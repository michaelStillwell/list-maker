/**
 * @typedef {Object} User
 *
 * @property {number} userId
 * @property {string} username
 */

/**
 * @typedef {Object} Session
 *
 * @property {string} sessionId
 * @property {number} userId
 */

/**
 * @typedef {Object} List
 * 
 * @property {number} listId
 * @property {string} title
 * @property {number} userId
 */

/** 
 * @param {{list_id: number, title: string, user_id: number}} row 
 * @returns {List}
 */
export function ListFromRow(row) {
	return {
		listId: row.list_id,
		title: row.title,
		userId: row.user_id
	}
}


/**
 * @typedef {Object} Item
 *
 * @property {number} itemId
 * @property {number} listId
 * @property {string} title
 * @property {number} userId
 */

/** 
 * @param {{item_id: number, title: string, list_id: number, user_id: number}} row 
 * @returns {Item}
 */
export function ItemFromRow(row) {
	return {
		itemId: row.item_id,
		title: row.title,
		listId: row.list_id,
		userId: row.user_id
	}
}

export default {};

