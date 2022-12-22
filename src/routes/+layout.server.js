export const load = async ({ locals }) => {
	const { getSession } = locals
	const session = await getSession()
	return {
		isAuth: session ? true : false,
		session: session,
		redirect: '/login'
	}
}
