import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import Database from '../database.js'

dotenv.config()

const generateAccessToken = (id, role_id) => {
	const payload = {
		id,
		role: role_id,
	}
	return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' })
}

class UsersModel {
	constructor() {
		this.db = new Database()
	}

	async GetUsers() {
		try {
			const sql = 'SELECT * FROM users'
			const results = await this.db.query(sql)
			return results
		} catch (error) {
			throw new Error(
				'Ошибка при получении всех пользователей: ' + error.message
			)
		}
	}

	async Login(username, password, email) {
		try {
			// Проверка, был ли предоставлен логин или email
			if (!username && !email) {
				return res.status(400).json({ error: 'Username or email is required for login' });
			}
			

			// Получение пользователя по логину или email
			const getUserQuery =
				'SELECT id, username, password, email, role_id FROM Users WHERE username = ? OR email = ?'
			const getUserValues = [username || '', email || '']
			const user = await this.db.query(getUserQuery, getUserValues)

			// Проверка наличия пользователя
			if (user.length === 0) {
				throw new Error('User not found')
			}

			// Проверка пароля
			const hashedPassword = user[0].password
			const passwordMatch = await bcrypt.compare(password, hashedPassword)

			if (!passwordMatch) {
				throw new Error('Invalid password')
			}

			const token = generateAccessToken(user[0].id, user[0].role_id)

			return { token }
		} catch (error) {
			throw new Error('Error during login: ' + error.message)
		}
	}

	// THIS IS: REGISTRATION
	async Registration(username, password, email, role_name) {
		try {
			// THIS IS: CHECK USERNAME
			const checkUserQuery = 'SELECT id FROM Users WHERE username = ?'
			const checkUserValues = [username]
			const existingUser = await this.db.query(checkUserQuery, checkUserValues)
			if (existingUser.length > 0) {
				throw new Error('Username is already taken')
			}

			// THIS IS: CHECK EMAIL
			const checkEmailQuery = 'SELECT id FROM Users WHERE email = ?'
			const checkEmailValues = [email]
			const existingEmail = await this.db.query(
				checkEmailQuery,
				checkEmailValues
			)
			if (existingEmail.length > 0) {
				throw new Error('Email is already registered')
			}

			// Получение id роли по названию
			const getRoleIdQuery = 'SELECT id FROM Roles WHERE role_name = ?'
			const getRoleIdValues = [role_name]
			const roleIdResult = await this.db.query(getRoleIdQuery, getRoleIdValues)

			if (roleIdResult.length === 0) {
				throw new Error('Role not found')
			}

			const role_id = roleIdResult[0].id

			// THIS IS: CREATE USER
			const insertUserQuery =
				'INSERT INTO Users (username, password, email, role_id) VALUES (?, ?, ?, ?)'
			const hashPassword = bcrypt.hashSync(password, 7)
			const insertUserValues = [username, hashPassword, email, role_id]
			const result = await this.db.query(insertUserQuery, insertUserValues)

			return result.insertId
		} catch (error) {
			throw new Error('Error creating user: ' + error.message)
		}
	}
}

export default UsersModel
