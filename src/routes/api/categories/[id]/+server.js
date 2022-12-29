import { ObjectId } from 'mongodb'

import client from '$lib/db'
const category = client.collection('categories')

export async function POST ({ request, params }) {
	try {
		const id = params.id || ''
		if (!id) {
			return new Response(JSON.stringify({ message: 'missing category ID' }), {
				status: 404
			})
		}
		var payload = await request.json()
		delete payload._id
		delete payload.id
		await category.updateOne({ _id: ObjectId(id) }, { $set: payload }, { upsert: true })
		return new Response(JSON.stringify({ message: 'ok' }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}

export async function DELETE ({ request, params }) {
	const id = params.id || ''
	try {
		if (!id) {
			return new Response(JSON.stringify({ message: 'missing category ID' }), {
				status: 404
			})
		}
		await category.deleteOne({ _id: ObjectId(id) })
		return new Response(JSON.stringify({ message: 'ok' }), {
			status: 200
		})
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}
