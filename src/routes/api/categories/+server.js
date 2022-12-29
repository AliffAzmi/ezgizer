import client from '$lib/db'
const category = client.collection('categories')

export async function GET ({ url, params }) {
	try {
		const value = url.searchParams.get('value')
		// if (!value) {
		// 	return new Response(JSON.stringify({ message: 'missing category' }), {
		// 		status: 404
		// 	})
		// }
		let payload = []
		if (value) {
			payload = await category.findOne({ value: value })
		} else {
			payload = await category.find({}).toArray()
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

export async function POST ({ request, params }) {
	var payload = await request.json()
	if (!payload) {
		return new Response(JSON.stringify({ message: 'missing body' }), {
			status: 404
		})
	}
	delete payload.id
	try {
		await category.updateOne({ name: payload.name }, { $set: payload }, { upsert: true })
		return new Response(JSON.stringify({ message: 'ok' }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}
