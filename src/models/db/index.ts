import Cloudflare from 'cloudflare'

const client = new Cloudflare({
	apiEmail: process.env.CLOUDFLARE_EMAIL,
	apiKey: process.env.CLOUDFLARE_API_KEY,
})

type QueryTypes = 'create' | 'select' | 'insert' | 'tables' | 'deleteEl' | 'deleteLi'

export const d1Query = async (type: QueryTypes, name?: string, value?: string | []) => {
	let results

	const queries = {
		'select': `SELECT * FROM ${name};`,
		'create': `CREATE TABLE ${name} (name string);`,
		'tables': `SELECT name FROM sqlite_master WHERE type = "table" AND name != "_cf_KV";`,
		'insert': `INSERT INTO ${name} (name) VALUES ("${value}");`,
		'deleteEl': `DELETE FROM ${name} WHERE name IN ("${typeof value == 'object' && (value as []).join('", "')}");`,
		'deleteLi': `DROP TABLE ${name};`
	}

	for await (const queryResult of client.d1.database.query(process.env.DB_ID as string, {
		account_id: process.env.ACCOUNT_ID as string,
		sql: queries[type]
	})) {
		results = type == 'create' || type == 'insert' || type == 'deleteEl' || type == 'deleteLi' ? queryResult.success : queryResult.results
	}
	
	return results
}