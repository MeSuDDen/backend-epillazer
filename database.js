import dotenv from 'dotenv'
import mysql2 from 'mysql2'

dotenv.config()

class Database {
	constructor() {
		this.pool = mysql2.createPool({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
		})
	}

	query(sql, values) {
		return new Promise((resolve, reject) => {
			this.pool.query(sql, values, (err, results) => {
				if (err) {
					reject(err)
					return
				}
				resolve(results)
			})
		})
	}

	close() {
    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

export default Database
