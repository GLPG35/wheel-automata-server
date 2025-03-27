import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createBunWebSocket } from 'hono/bun'
import { randomUUIDv7, type ServerWebSocket } from 'bun'
import { jwt } from 'hono/jwt'
import ElementModel from './models/element'
import { HTTPException } from 'hono/http-exception'
import api from './routes/api'
import auth from './routes/auth'

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>()
const topic = 'wheel'

const app = new Hono()

app.use(cors({
	origin: process.env.CLIENT_URL as string,
    credentials: true
}))

app.use('/api/*', jwt({ secret: process.env.SECRET as string, cookie: 'jwtCookie' }))
app.get('/auth/*', jwt({ secret: process.env.SECRET as string, cookie: 'jwtCookie' }))

app.onError((err, c) => {
	console.log(err.message)
	if (err instanceof HTTPException) return c.json({ success: false, message: err.message }, err.status)

	return c.json({ success: false, message: err.message }, 500)
})

app.route('/api', api)
app.route('/auth', auth)

const server = Bun.serve({
	fetch: app.fetch,
	websocket
})

let lastSelected: {
	type: string,
	success: boolean,
	listName: any,
	selected: any,
	random: number[]
} | undefined = undefined

let users: { username: string, pic: number, id?: string }[] = []

let spinning = false
let wheelEnded: { ended: boolean, user?: string } = {
	ended: false,
	user: undefined
}

app.get('/ws',
	upgradeWebSocket(() => {
		return {
			onOpen: (_event, ws) => {
				const subscribers = server.subscriberCount(topic)
				
				const rawWs = ws.raw as ServerWebSocket<{ id: string } | undefined>
				rawWs.subscribe(topic)
				
				if (rawWs.data) rawWs.data.id = randomUUIDv7()

				if (subscribers > 0 && lastSelected) {
					ws.send(JSON.stringify(lastSelected))
					if (spinning) ws.send(JSON.stringify({ type: 'spinning', success: true }))
					if (wheelEnded.ended) ws.send(JSON.stringify({ type: 'wheelEnded', success: true, username: wheelEnded.user }))
				}
			},
			onMessage: async (event, ws) => {
				const data = JSON.parse(event.data as string)
				const { type, listName, value, user } = data
				type ReqTypes = 'addList' | 'addElement' | 'deleteElement' | 'deleteList' | 'selectList' | 'spinWheel' | 'endWheel' | 'resetWheel' | 'user'
				
				const reqTypes = {
					'addList': async () => {
						if (listName) {
							const success = await ElementModel.addList(listName)
							const [firstLetter, ...rest] = listName.split('')
							const tableName = `${firstLetter.toUpperCase()}${rest.join('')}`

							server.publish(topic, JSON.stringify({ type: 'addedList', success, added: tableName }))
						}
					},
					'addElement': async () => {
						if (listName && value) {
							server.publish(topic, JSON.stringify({ type: 'addedElement', success: true, added: value, listName }))

							await ElementModel.addElement(listName, value)
						}
					},
					'deleteElement': async () => {
						if (listName && value) {
							server.publish(topic, JSON.stringify({ type: 'deletedElement', success: true, listName, added: value }))

							ElementModel.deleteElement(listName, value)
						}
					},
					'deleteList': async () => {
						if (listName) {
							server.publish(topic, JSON.stringify({ type: 'deletedList', success: true, listName }))

							ElementModel.deleteList(listName)
						}
					},
					'selectList': () => {
						if (listName && value.length) {
							const random = Math.floor(Math.random() * 360)
							const randomMatch = Math.floor(Math.random() * 2)
							const selected = {
								type: 'selected',
								success: true,
								listName,
								selected: value,
								random: [random, randomMatch]
							}
							
							server.publish(topic, JSON.stringify(selected))
							lastSelected = selected
							wheelEnded.ended = false
							wheelEnded.user = undefined
						}
					},
					'spinWheel': () => {
						spinning = true
						server.publish(topic, JSON.stringify({ type: 'spin', success: true }))
					},
					'endWheel': () => {
						const rawWs = ws.raw as ServerWebSocket<{ id: string } | undefined>
						const id = rawWs.data?.id

						const findUser = users.find(x => x.id == id)

						spinning = false
						wheelEnded.ended = true
						wheelEnded.user = findUser?.username

						server.publish(topic, JSON.stringify({ type: 'wheelEnded', username: findUser?.username }))
					},
					'resetWheel': () => {
						const random = Math.floor(Math.random() * 360)
						const randomMatch = Math.floor(Math.random() * 2)
						wheelEnded.ended = false
						wheelEnded.user = undefined

						if (lastSelected) {
							lastSelected.random = [random, randomMatch]
							const { type, ...rest } = lastSelected
							
							server.publish(topic, JSON.stringify({ type: 'reset', ...rest }))
						}
					},
					'clearWheel': () => {
						if (lastSelected) {
							lastSelected = undefined
							wheelEnded.ended = false
							wheelEnded.user = undefined

							server.publish(topic, JSON.stringify({ type: 'cleared', success: true }))
						}
					},
					'user': () => {
						if (user) {
							const rawWs = ws.raw as ServerWebSocket<{ id: string } | undefined>
							const id = rawWs.data?.id
							
							user.id = id

							if (!users.find(x => x.id === id)) users.push(user)

							server.publish(topic, JSON.stringify({ type: 'userConnected', success: true, users }))
						}
					}
				}

				reqTypes[type as ReqTypes]()
			},
			onClose: (_event, ws) => {
				const rawWs = ws.raw as ServerWebSocket<{ id: string } | undefined>
				const id = rawWs.data?.id

				users = users.filter(x => x.id !== id)
				rawWs.unsubscribe(topic)
				
				if (server.subscriberCount(topic) < 1) {
					lastSelected = undefined
					spinning = false
					wheelEnded.ended = false
					wheelEnded.user = undefined
				} else {
					server.publish(topic, JSON.stringify({ type: 'userConnected', success: true, users }))
				}
			}
		}
	})
)
