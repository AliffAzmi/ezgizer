import client from '$lib/db'
const users = client.collection('users')

export async function GET ({ url, params }) {
	try {
		const uid = params.uid || ''
		if (!uid) {
			return new Response(JSON.stringify({ message: 'missing user ID' }), {
				status: 404
			})
		}
		const payload = await users.findOne({ id: uid })
		return new Response(JSON.stringify({ user: payload }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}
