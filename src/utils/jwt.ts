import { sign } from 'hono/jwt'
import { JWTPayload } from 'hono/utils/jwt/types'

export const createToken = async (username: string) => {
	const days = 2
	const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * days
	const pic = Math.random()

	const payload: JWTPayload = {
		username,
		pic,
		exp
	}

	const secret = process.env.SECRET as string
	const token = await sign(payload, secret)

	return {
		username,
		pic,
		token
	}
}