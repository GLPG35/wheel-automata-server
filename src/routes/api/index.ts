import { Hono } from 'hono';
import ElementModel from '../../models/element';

const api = new Hono()

api.get('/getList/:listName', async (c) => {
	const listName = c.req.param('listName')
	const list = await ElementModel.getList(listName)
	
	return c.json(list)
})

api.get('/getLists', async (c) => {
	const list = await ElementModel.getLists()

	return c.json(list)
})

export default api