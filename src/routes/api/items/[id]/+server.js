import client from '$lib/db'
import { ObjectId } from 'mongodb'
const items = client.collection('items')

export async function DELETE ({ url, params }) {
	try {
		const id = params.id || ''
		if (!id) {
			return new Response(JSON.stringify({ message: 'missing item ID' }), {
				status: 404
			})
		}
		const response = await items.deleteOne({ _id: ObjectId(id) })
		return new Response(JSON.stringify({ message: 'ok' }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}
