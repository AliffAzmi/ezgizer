import { browser } from '$app/environment'
import { writable, derived } from 'svelte/store'

const defaultValue = 'system'
const initialValue = browser ? window.localStorage.getItem('theme') ?? defaultValue : defaultValue

const items = writable({})
const filteredItems = writable({})

const theme = writable(initialValue)

export { items, filteredItems, theme }
