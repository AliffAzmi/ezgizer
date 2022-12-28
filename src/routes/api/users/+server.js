import client from '$lib/db'
const users = client.collection('users')

export async function GET ({ url, params }) {
	try {
		const user_id = url.searchParams.get('user_id')
		const email = url.searchParams.get('email')
		// if (!user_id) {
		// 	return new Response(JSON.stringify({ message: 'missing user ID' }), {
		// 		status: 404
		// 	})
		// }
		const payload = await users.findOne({ email: email })
		return new Response(JSON.stringify({ users: payload }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}
