const db = require('better-sqlite3')("database.db")

class DB {
    async prepare(query) {
        return await db.prepare(query)
    }

    async run(query, data = []) {
        let result = await this.prepare(query)
        return result.run(data)
    }

    async get(query, data = []) {
        let result = await this.prepare(query)
        return result.get(data)
    }

    async all(query, data = []) {
        let result = await this.prepare(query)
        return result.all(data)
    }
}

module.exports = new DB()