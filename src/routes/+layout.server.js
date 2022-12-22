import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, url }) => {
	const { getSession } = locals
	const session = await getSession()
	if (url.pathname === '/' && session) {
		throw redirect(302, `/dashboard`)
	}
	return {
		isAuth: session ? true : false,
		session: session,
		redirect: session ? '/dashboard' : '/login'
	}
}
