import { Hono } from 'hono';
import AuthModel from '../models/auth'
import { setCookie } from 'hono/cookie'

const auth = new Hono()

auth.post('/', async c => {
	const { username, hash } = await c.req.json()

	return AuthModel.login(username as string, hash as string)
	.then(userWithToken => {
		const { token, ...user } = userWithToken
		const date = new Date()
		date.setDate(date.getDate() + 2)

		setCookie(c, 'jwtCookie', token, {
			httpOnly: true,
			secure: true,
			expires: new Date(date.toUTCString()),
			sameSite: 'None',
			partitioned: true
		})

		return c.json({ success: true, data: user })
	})
})

auth.get('/', async c => {
	const payload = c.get('jwtPayload')
	const { exp, ...user } = payload

	return c.json({ success: true, data: user })
})

export default auth