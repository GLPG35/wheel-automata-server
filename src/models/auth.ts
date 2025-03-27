import { createToken } from '../utils/jwt'
import { HTTPException } from 'hono/http-exception'

class AuthModel {
	public static login = (username: string, hash: string) => {
		const trueHash = process.env.TRUE_HASH

		if (trueHash !== hash) {
			console.log('hola')
			throw new HTTPException(401, { message: 'Please provide the right [credentials]' })
		}

		return createToken(username)
	}
}

export default AuthModel