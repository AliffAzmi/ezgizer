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
	let settingPayload
	if (session) {
		let { user } = session
		userPayload = await users.findOne({ email: user.email }, { _id: 0 })
		if (userPayload) {
			userPayload._id = userPayload._id.toString().replace(/ObjectId\("(.*)"\)/, '$1')
		}

		settingPayload = await settings.findOne({ user_id: user.id })
		if (settingPayload) {
			settingPayload._id = settingPayload._id.toString().replace(/ObjectId\("(.*)"\)/, '$1')
		}
	}

	return {
		isAuth: session ? true : false,
		session: session,
		user: userPayload || {},
		setting: settingPayload || {},
		redirect: session ? '/dashboard' : '/login'
	}
}
