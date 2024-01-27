import express from 'express'
import UsersModel from '../models/usersModel.js'
import authorizationToken from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'

const router = express.Router()
const usersModel = new UsersModel()

router.get('/getAll', roleMiddleware([1]), async (req, res) => {
	try {
		const usersGet = await usersModel.GetUsers()
		res.json(usersGet)
	} catch (error) {
		console.error('Error fetching users: ', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

router.post('/create', async (req, res) => {
	const { username, password, email, role_id } = req.body

	try {
		const createUser = await usersModel.Registration(
			username,
			password,
			email,
			role_id
		)
		res.status(201)
		res.json({ id: createUser, message: 'User created successfully' })
	} catch (error) {
		console.error('Error creating user: ', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

router.post('/login', async (req, res) => {
	const { username, password, email } = req.body;

	try {
			const loginUser = await usersModel.Login(username, password, email);
			res.status(200).json(loginUser);
	} catch (error) {
			console.error('Error during login: ', error);
			res.status(401).json({ error: 'Invalid credentials' });
	}
})
export default router
