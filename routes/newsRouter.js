import express from 'express'
import NewsModel from '../models/newsModel.js'

const router = express.Router()
const newsModel = new NewsModel()

// Маршрут "Последнии новости"
router.get('/news/latest', async (req, res) => {
	const limit = req.query.limit || 10
	const sortBy = req.query.sortBy || 'date_published'

	try {
		const latestNews = await newsModel.getLatestNews(limit, sortBy)
		res.json(latestNews)
	} catch (error) {
		console.error('Error fetching latest news: ', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

// Маршрут "Все новости"
router.get('/news', async (req, res) => {
	const limit = parseInt(req.query.limit) || 3;
  const offset = parseInt(req.query.offset) || 0;
  const sortBy = req.query.sortBy || 'date_published';

  try {
    const news = await newsModel.getAllNews({ limit, offset, sortBy });
    res.json(news);
  } catch (error) {
    console.error('Ошибка получения всех новостей:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
})

// Маршрут "Определенная новость"
router.get('/news/:slug', async (req, res) => {
	const { slug } = req.params

	try {
		const newsArticle = await newsModel.getNewsBySlug(slug)
		if (!newsArticle) {
			res.status(404).json({ error: 'News not found!' })
		} else {
			res.json(newsArticle)
		}
	} catch (error) {
		console.error('Error fetching news by slug: ', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

// Маршрут "Создание новости"
router.post('/news/create', async (req, res) => {
	const { title, link, article_text, date_published, image_url } = req.body

	try {
		const newNewsId = await newsModel.CreateNews(
			title,
			link,
			article_text,
			date_published,
			image_url
		)
		res
			.status(201)
			.json({ id: newNewsId, message: 'News created successfully' })
	} catch (error) {
		console.error('Error creating news: ', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

export default router
