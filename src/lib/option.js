/**
 * @template T
 */
export default class Option {
	/** @type {T|null} */
	#value = null;

	/**
	 * @param {T|null} value 
	 */
	constructor(value = null) {
		this.#value = value;
	}

	/** 
	 * @template T
	 * @param {T} value
	 * @returns {Option<T>}
	 */
	static some(value) {
		return new Option(value);
	}

	/** 
	 * @template T
	 * @returns {Option<T>}
	 */
	static none() {
		return new Option();
	}

	/**
	 * Returns if the value is empty
	 * @returns {boolean} If value is empty
	 */
	isNone() {
		return this.#value === null || this.#value === undefined;
	}

	/**
	 * Returns if the value is not empty
	 * @returns {boolean} If value is not empty
	 */
	isSome() {
		return this.#value !== null && this.#value !== undefined;
	}

	/**
	 * @returns {T} Returns value, throws Error if none
	 */
	unwrap() {
		if (this.isNone()) {
			throw new Error('Option is None');
		}

		// @ts-ignore
		// NOTE: this is never going to be null since none errors above
		return this.#value;
	}

	/**
	 * @param {T} value
	 * @returns {T} Returns the default value if Option is None
	 */
	unwrapOr(value) {
		if (this.isNone()) {
			return value;
		}

		// @ts-ignore
		// NOTE: this is never going to be null since none errors above
		return this.#value;
	}
}

