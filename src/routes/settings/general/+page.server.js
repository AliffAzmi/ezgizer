import client from '$lib/db'
const users = client.collection('users')
const settings = client.collection('settings')

export const actions = {
	default: async ({ event, request }) => {
		const form = await request.formData()
		const uid = form.get('id')
		const payload = Object.fromEntries(form.entries())
		if (uid) {
			await users.updateOne({ id: uid }, { $set: { income: parseInt(payload.income) } })
			delete payload.income
			delete payload.id
			await settings.updateOne({ user_id: uid }, { $set: payload }, { upsert: true })
			return { success: true, message: 'Updated' }
		}
	}
}
