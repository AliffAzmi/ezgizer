// import { NextAuthHandler } from 'next-auth/core'
// import GoogleProvider from 'next-auth/providers/google'
import SvelteKitAuth from "@auth/sveltekit"
import GoogleProvider from '@auth/core/providers/google';
import cookie from 'cookie'
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, APP_URL } from '$env/static/private'

const google = GoogleProvider?.default || GoogleProvider

export const options = {
	providers: [
		google({
			clientId: GOOGLE_OAUTH_CLIENT_ID,
			clientSecret: GOOGLE_OAUTH_CLIENT_SECRET
		})
	]
}

const toSvelteKitResponse = async (request, nextAuthResponse) => {
	const { cookies, redirect } = nextAuthResponse

	const headers = new Headers()
	for (const header of nextAuthResponse?.headers || []) {
		// pass headers along from next-auth
		headers.set(header.key, header.value)
	}

	// set-cookie header
	if (cookies?.length) {
		headers.set(
			'set-cookie',
			cookies?.map(item => cookie.serialize(item.name, item.value, item.options)).join(',')
		)
	}

	let body = undefined
	let status = nextAuthResponse.status || 200

	if (redirect) {
		let formData = null
		try {
			formData = await request.formData()
		} catch {
			// no formData passed
		}
		const { json } = Object.fromEntries(formData ?? [])
		if (json !== 'true') {
			status = 302
			headers.set('Location', redirect)
		} else {
			body = { url: redirect }
		}
	} else {
		body = nextAuthResponse.body
	}

	return new Response(body, { status, headers })
}

const SKNextAuthHandler = async ({ request, url, params }, options) => {
	const [action, provider] = params.nextauth?.split('/')
	let body
	try {
		body = await request.formData()
	} catch {
		// no formData passed
	}
	options.secret = 'NEXTAUTH_SECRET'
	const req = {
		host: APP_URL,
		body: Object.fromEntries(body ?? []),
		query: Object.fromEntries(url.searchParams),
		headers: request.headers,
		method: request.method,
		cookies: cookie.parse(request.headers.get('cookie') || ''),
		action: action,
		providerId: provider,
		error: provider,
		redirect: `${APP_URL}/dashboard`
	}
	req.cookies['next-auth.callback-url'] = 'http://localhost:5173/dashboard'

	const response = await SvelteKitAuth({
		req,
		options
	})

	return toSvelteKitResponse(request, response)
}

export const getServerSession = async (request, options) => {
	options.secret = 'NEXTAUTH_SECRET'

	const session = await SvelteKitAuth({
		req: {
			host: APP_URL,
			action: 'session',
			method: 'GET',
			cookies: cookie.parse(request.headers.get('cookie') || ''),
			headers: request.headers
		},
		options
	})

	const { body } = session

	if (body && Object.keys(body).length) {
		return body
	}
	return null
}

export const NextAuth = options => ({
	GET: event => SKNextAuthHandler(event, options),
	POST: event => SKNextAuthHandler(event, options)
})
