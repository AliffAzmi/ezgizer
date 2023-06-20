import client from '$lib/db'
import { getDiffPercentage } from '$lib/utils'
const utilities = client.collection('utilities')

export async function GET ({ locals, url, params }) {
	try {
		const { getSession } = locals
		const session = await getSession()

		let user_id
		user_id = session ? session?.user?.id : ''

		const period = url.searchParams.get('period')

		let payload = []
		if (!user_id && !period) {
			return new Response(JSON.stringify({ message: 'missing parameters' }), {
				status: 404
			})
		}
		if (period.includes('to')) {
			payload = await utilities
				.find({
					user_id: user_id,
					month_year: { $regex: '2022' }
				})
				.toArray()
		} else {
			payload = await utilities
				.find({
					user_id: user_id,
					month_year: period
				})
				.toArray()
		}
		if (payload) {
			const results = payload.map(pl => {
				const { items } = pl

				let total = items.reduce((n, { price }) => parseInt(n) + parseInt(price), 0)

				let pending = items
					.filter(it => !it.status || it.status === 0 || it.status === false)
					.reduce((n, { price }) => parseInt(n) + parseInt(price), 0)

				let spent = items
					.filter(it => it.status || it.status === 1)
					.reduce((n, { price }) => parseInt(n) + parseInt(price), 0)

				let most_utilities = items.sort((a, b) => b.price - a.price)
				let most_categories = []
				items.reduce(function (res, value) {
					if (!res[value.category]) {
						res[value.category] = {
							name: value.category,
							price: 0,
							txns: 0
						}
						most_categories.push(res[value.category])
					}

					res[value.category].price += parseInt(value.price)
					res[value.category].txns = res[value.category].txns + 1
					return res
				}, {})
				// let most_categories = items.reduce(
				// 	(acc, item) => ({
				// 		...acc,
				// 		[item.category]: (acc[item.category] || 0) + parseInt(item.price)
				// 	}),
				// 	{}
				// )

				let performance = getDiffPercentage(spent, total).toFixed(2)
				return {
					total,
					pending,
					spent,
					performance,
					most_utilities,
					most_categories
				}
			})
			return new Response(JSON.stringify(results.length ? results[0] : []), {
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
