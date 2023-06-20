import client from '$lib/db'
const category = client.collection('categories')

export async function GET ({ locals, url, params }) {
	try {
		const { getSession } = locals
		const session = await getSession()

		let user_id
		user_id = session ? session?.user?.id : ''

		const value = url.searchParams.get('value')

		if (!user_id) {
			return new Response(JSON.stringify({ message: 'undefined user' }), {
				status: 404
			})
		}

		let payload = []
		if (value) {
			payload = await category.findOne({ user_id, value })
		} else {
			payload = await category.find({ user_id }).toArray()
		}
		return new Response(JSON.stringify({ category: payload }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}

export async function POST ({ locals, request, params }) {
	const { getSession } = locals
	const session = await getSession()

	let user_id
	user_id = session ? session?.user?.id : ''

	if (!user_id) {
		return new Response(JSON.stringify({ message: 'undefined user' }), {
			status: 404
		})
	}

	var payload = await request.json()
	if (!payload) {
		return new Response(JSON.stringify({ message: 'missing body' }), {
			status: 404
		})
	}
	delete payload.id
	payload.user_id = user_id
	try {
		await category.updateOne({ user_id: user_id }, { $set: payload }, { upsert: true })
		return new Response(JSON.stringify({ message: 'ok' }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}
