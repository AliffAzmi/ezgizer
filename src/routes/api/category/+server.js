import client from '$lib/db'
const category = client.collection('categories')

export async function GET ({ url, params }) {
	try {
		const value = url.searchParams.get('value')
		if (!value) {
			return new Response(JSON.stringify({ message: 'missing category' }), {
				status: 404
			})
		}
		const payload = await category.findOne({ value: value })
		return new Response(JSON.stringify({ category: payload }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}
