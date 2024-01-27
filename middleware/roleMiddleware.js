import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

function roleMiddleware(roles) {
	return function (req, res, next) {
		if (req.method === 'OPTIONS') {
			next()
		}
		try {
			const token = req.headers.authorization.split(' ')[1]
			if (!token) {
				return res.status(403).json({ message: 'Пользователь не авторизован' })
			}

			let userRoles
			try {
				// Пытаемся извлечь роли из токена
				;({ role: userRoles } = jwt.verify(token, process.env.SECRET_KEY))
			} catch (error) {
				// Обработка ошибки в случае отсутствия свойства roles
				console.error('Role extraction error:', error)
				return res
					.status(403)
					.json({ message: 'Ошибка при получении ролей пользователя' })
			}

			if (typeof userRoles !== 'number') {
				return res
					.status(403)
					.json({ message: 'Отсутствуют или некорректны роли пользователя' })
			}

			let hasRole = false
			if (Array.isArray(userRoles)) {
				userRoles.forEach(role => {
					if (roles.includes(role)) {
						hasRole = true
					}
				})
			} else {
				// Если userRoles не является массивом, просто проверьте наличие роли в массиве roles
				if (roles.includes(userRoles)) {
					hasRole = true
				}
			}

			if (!hasRole) {
				return res.status(403).json({ message: 'У вас нет доступа' })
			}

			next()
		} catch (error) {
			console.error(error)
			return res.status(403).json({ message: 'Пользователь не авторизован' })
		}
	}
}

export default roleMiddleware
