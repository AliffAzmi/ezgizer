import client from '$lib/db'
const utilities = client.collection('utilities')

export async function GET ({ url, params }) {
	try {
		const user_id = url.searchParams.get('user_id')
		const period = url.searchParams.get('period')
		if (!user_id && !period) {
			return new Response(JSON.stringify({ message: 'missing parameters' }), {
				status: 404
			})
		}
		const payload = await utilities.findOne({
			user_id: user_id,
			month_year: period
		})
		if (payload) {
			const { items } = payload

			const total = items.reduce((n, { price }) => parseInt(n) + parseInt(price), 0)

			const pending = items
				.filter(it => !it.status || it.status === 0 || it.status === false)
				.reduce((n, { price }) => parseInt(n) + parseInt(price), 0)

			const spent = items
				.filter(it => it.status || it.status === 1)
				.reduce((n, { price }) => parseInt(n) + parseInt(price), 0)

			const performance = '20.5%'

			return new Response(JSON.stringify({ total, pending, spent, performance }), {
				status: 200
			})
		} else {
			return new Response(JSON.stringify({ message: 'not found' }), {
				status: 200
			})
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500
		})
	}
}
