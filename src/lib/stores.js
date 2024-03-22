import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<import('$lib/models').User?>} */
export const user = writable(null);
