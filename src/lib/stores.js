import { browser } from '$app/environment'
import { writable } from 'svelte/store'

const defaultValue = 'system'
const initialValue = browser ? window.localStorage.getItem('theme') ?? defaultValue : defaultValue

const items = writable({})
const theme = writable(initialValue)

export { items, theme }
