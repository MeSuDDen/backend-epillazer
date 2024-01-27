import Database from '../database.js'

class NewsModel {
	constructor() {
		this.db = new Database()
	}

	async getAllNews({ limit = 3, offset = 0, sortBy = 'date_published' }) {
    try {
      const allowedSortByValues = ['date_published'];

      if (!allowedSortByValues.includes(sortBy)) {
        throw new Error('Недопустимое значение sortBy');
      }

      const sql = `SELECT * FROM news ORDER BY ${sortBy} DESC LIMIT ?, ?`;
      const values = [offset, limit];

      const results = await this.db.query(sql, values);
      return results;
    } catch (error) {
      throw new Error('Ошибка при получении всех новостей: ' + error.message);
    }
  }

	async getLatestNews(limit = 10, sortBy = 'date_published') {
		try {
			// Преобразуйте значение limit в число перед передачей
			limit = parseInt(limit, 10)

			const sql = `SELECT * FROM news ORDER BY ${sortBy} DESC LIMIT ?`
			const results = await this.db.query(sql, [limit])
			return results
		} catch (error) {
			throw new Error(
				'Ошибка при получении последних новостей: ' + error.message
			)
		}
	}

	async CreateNews(title, link, article_text, date_published, image_url) {
		try {
			const sql =
				'INSERT INTO news (title, link, article_text, date_published, image_url) VALUES (?, ?, ?, ?, ?)'
			const values = [title, link, article_text, date_published, image_url]

			const result = await this.db.query(sql, values)
			return result.insertId
		} catch (error) {
			throw new Error('Error creating news: ' + error.message)
		}
	}

	async getNewsBySlug(slug) {
		try {
			const sql = 'SELECT * FROM news WHERE link = ?'
			const result = await this.db.query(sql, [slug])

			if (result.length === 0) {
				return null // News not found
			}

			return result[0] // Return the first result (assuming link is unique)
		} catch (error) {
			throw new Error('Error fetching news by slug: ' + error.message)
		}
	}

	async close() {
    await this.db.close();
  }
}

export default NewsModel
