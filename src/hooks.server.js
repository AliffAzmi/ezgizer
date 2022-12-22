import { sequence } from '@sveltejs/kit/hooks'
import SvelteKitAuth from '@auth/sveltekit'
import Google from '@auth/core/providers/google'
import {
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	NEXTAUTH_SECRET
} from '$env/static/private'

const auth = SvelteKitAuth({
	providers: [
		Google({ clientId: GOOGLE_OAUTH_CLIENT_ID, clientSecret: GOOGLE_OAUTH_CLIENT_SECRET })
	],
	secret: NEXTAUTH_SECRET,
	session: { jwt: true },
	callbacks: {
		redirect: async (url, _) => {
			return Promise.resolve('/dashboard')
		}
	}
})

const restriction = async ({ event, resolve }) => {
	// const path = event.url.pathname
	// const accessToken = parse(event.request.headers.get('cookie') || "")?.access_token;
	// if (path.startsWith('/') || path.startsWith('/login')) {
	// 	return new Response(null, {
	// 		status: 302,
	// 		headers: {
	// 			location: '/dashboard'
	// 		}
	// 	})
	// }

	return await resolve(event)
}

export const handle = sequence(auth, restriction)
