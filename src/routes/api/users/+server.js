export async function GET ({ request, response }) {
	try {
		return new Response(JSON.stringify({ message: 'ok' }), {
			status: 200
		})
	} catch (error) {
		return error
	}
}
