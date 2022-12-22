import client from '$lib/db'
const users = client.collection('users')

export async function GET ({ url, params }) {
	try {
		const user_id = url.searchParams.get('user_id')
		if (!user_id) {
			return new Response(JSON.stringify({ message: 'missing user ID' }), {
				status: 404
			})
		}
		const payload = await users.find({}).sort({ id: -1 }).limit(10).toArray()
		return new Response(JSON.stringify({ users: payload }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}
