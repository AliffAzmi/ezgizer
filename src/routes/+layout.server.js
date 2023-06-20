import { redirect } from '@sveltejs/kit'
import client from '$lib/db'

const users = client.collection('users')

export const load = async ({ locals, url }) => {
	const { getSession } = locals
	const session = await getSession()

	if (url.pathname === '/' && session) {
		throw redirect(302, `/dashboard`)
	}

	let userPayload
	if (session) {
		let { user } = session
		userPayload = await users.findOne({ email: user.email }, { _id: 0 })
		userPayload._id = userPayload._id.toString().replace(/ObjectId\("(.*)"\)/, '$1')
	}

	return {
		isAuth: session ? true : false,
		session: session,
		user: userPayload || {},
		redirect: session ? '/dashboard' : '/login'
	}
}
