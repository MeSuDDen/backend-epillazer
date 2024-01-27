import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import formRouter from './routes/formRouter.js'
import newsRouter from './routes/newsRouter.js'
import usersRouter from './routes/usersRouter.js'

// Подключения переменного окружения
dotenv.config()

// Инициализация приложения
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', newsRouter)
app.use('/api', formRouter)
app.use('/users', usersRouter)

// Подключение порта из переменного окружения
const PORT = process.env.PORT || 3031

async function startApp() {
	try {
		app.listen(PORT, () =>
			console.log(`Server started on http://localhost:${PORT}`)
		)
	} catch (e) {
		console.log(e)
	}
}
// Запуск приложения
startApp()
