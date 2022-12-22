import SvelteKitAuth from '@auth/sveltekit'
import Google from '@auth/core/providers/google'
import {
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	NEXTAUTH_SECRET
} from '$env/static/private'

export const handle = SvelteKitAuth({
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
