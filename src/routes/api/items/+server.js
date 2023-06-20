import client from '$lib/db'
const items = client.collection('items')

export async function GET ({ locals, url, params }) {
	try {
		const { getSession } = locals
		const session = await getSession()

		let user_id
		user_id = session ? session?.user?.id : ''

		if (!user_id) {
			return new Response(JSON.stringify({ message: 'missing user ID' }), {
				status: 404
			})
		}
		const payload = await items.find({ user_id: user_id }).sort({ price: -1 }).toArray()
		return new Response(JSON.stringify({ items: payload }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}

export async function POST ({ request, response }) {
	try {
		var payload = await request.json()
		payload.items.map(async item => {
			await items.updateMany(
				{ name: item.name },
				{
					$set: {
						name: item.name,
						price: parseInt(item.price),
						category: item.category,
						user_id: payload.user_id
					}
				},
				{ upsert: true }
			)
		})

		return new Response(JSON.stringify({ message: 'ok' }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}
