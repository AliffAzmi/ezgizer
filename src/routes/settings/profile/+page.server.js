import client from '$lib/db'
const users = client.collection('users')

export async function load ({ cookies, locals }) {
	let { user } = await locals.getSession()
	const userPayload = await users.findOne({ email: user.email }, { _id: 0 })
	userPayload._id = userPayload._id.toString().replace(/ObjectId\("(.*)"\)/, '$1')
	return { user: userPayload }
}

export const actions = {
	default: async ({ event, request }) => {
		const form = await request.formData()
		const uid = form.get('id')
		const payload = Object.fromEntries(form.entries())
		if (uid) {
			const res = await users.updateOne({ id: uid }, { $set: payload })
			return { success: true, message: 'User updated' }
		}
	}
}
