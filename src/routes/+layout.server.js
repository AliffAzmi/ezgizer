import { redirect } from '@sveltejs/kit'
import client from '$lib/db'

const users = client.collection('users')
const settings = client.collection('settings')

export const load = async ({ locals, url }) => {
	const { getSession } = locals
	const session = await getSession()

	if (url.pathname === '/' && session) {
		throw redirect(302, `/dashboard`)
	}

	let userPayload
	let setting
	if (session) {
		let { user } = session
		userPayload = await users.findOne({ email: user.email }, { _id: 0 })
		userPayload._id = userPayload._id.toString().replace(/ObjectId\("(.*)"\)/, '$1')

		const settingPayload = await settings.findOne({ user_id: user.id })
		settingPayload._id = settingPayload._id.toString().replace(/ObjectId\("(.*)"\)/, '$1')
		setting = settingPayload
	}

	return {
		isAuth: session ? true : false,
		session: session,
		user: userPayload || {},
		setting: setting || {},
		redirect: session ? '/dashboard' : '/login'
	}
}
