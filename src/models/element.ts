import { d1Query } from './db'

class ElementModel {
	public static getList = async (listName: string) => {
		const results = await d1Query('select', listName)
		
		return results
	}
	
	public static getLists = async () => {
		const results = await d1Query('tables')
	
		return results
	}
	
	public static addElement = async (listName: string, value: string) => {
		const results = await d1Query('insert', listName, value)
	
		return results
	}
	
	public static addList = async (listName: string) => {
		const [firstLetter, ...rest] = listName.split('')
		const tableName = `${firstLetter.toUpperCase()}${rest.join('')}`
		const list = await this.getLists()
		
		if (list) {
			const find = (list as { name: string }[]).find(x => x.name == tableName)
	
			if (find !== undefined) return false
		}
	
		const results = await d1Query('create', tableName)
	
		return results
	}
	
	public static deleteElement = async (listName: string, value: string) => {
		const results = await d1Query('deleteEl', listName, value)
	
		return results
	}

	public static deleteList = async (listName: string) => {
		const results = await d1Query('deleteLi', listName)

		return results
	}
}

export default ElementModel