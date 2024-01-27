import express from 'express'
import FormModel from '../models/formModel.js'

const router = express.Router()
const formModel = new FormModel()

router.post('/form/email', async (req, res) => {
	const { name, phone } = req.body
	let text = req.body.text
	let email = req.body.email

	if (!name || !phone) {
		return res
			.status(400)
			.json({ error: 'Name and phone are required fields.' })
	}

	const formattedText = text ? text : 'Отсутствует';
  const formattedEmail = email ? email : 'Отсутствует';

	try {
		const result = await formModel.sendContactForm({ name, phone, text: formattedText, email: formattedEmail })
		res.json(result)
	} catch (error) {
		console.error('Error sending contact form: ', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

export default router
