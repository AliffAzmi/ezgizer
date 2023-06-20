import client from '$lib/db'
import md5 from 'md5'
// import { ObjectId } from 'mongodb'
const utilities = client.collection('utilities')

export async function GET ({ locals, url, params }) {
	try {
		const { getSession } = locals
		const session = await getSession()

		let user_id
		user_id = session ? session?.user?.id : ''

		const month_year = url.searchParams.get('month_year') || '11-22'
		const { status } = JSON.parse(url.searchParams.get('queries')) || {}

		if (!user_id) {
			return new Response(JSON.stringify({ message: 'undefined user' }), {
				status: 404
			})
		}

		try {
			const res = await utilities.findOne({ user_id, month_year })
			if (status || status === 0) {
				res.items = res.items.filter(item => item.status === status)
			}
			if (res) {
				res.total = res.items
					.map(item => item.price)
					.reduce((prev, next) => parseInt(prev) + parseInt(next))
			}

			return new Response(JSON.stringify(res), {
				status: 200
			})
		} catch (error) {
			return new Response(JSON.stringify({ message: error.message }), {
				status: 500
			})
		}
	} catch (error) {
		return error
	}
}

export async function POST ({ request, response }) {
	try {
		var payload = await request.json()
		payload.items.filter(item => delete item.idx)
		payload.items.map(item => (item.id = md5(item.name)))
		try {
			await utilities.updateOne(
				{ $and: [{ user_id: payload.user_id, month_year: payload.month_year }] },
				{ $set: payload },
				{ upsert: true }
			)
		} catch (error) {
			console.log(error)
		}
		return new Response(JSON.stringify({ message: 'ok' }), {
			status: 200
		})
	} catch (error) {
		return error
	}
}
