import nodemailer from 'nodemailer'
import Database from '../database.js'

class FormModel {
	constructor() {
		this.db = new Database()
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'rusokoro2002@gmail.com',
				pass: 'ypur ojln ksci xzfv',
			},
			secure: false,
			tls: {
				rejectUnauthorized: false,
			},
		})
	}

	async sendContactForm({ name, phone, text, email }) {
		try {
			const mailOptions = {
				from: 'rusokoro2002@gmail.com',
				to: 'rusokoro2002@gmail.com',
				subject: 'Новая заявка от клиента',
				text: `Имя: ${name}\nТелефон: ${phone}\nПочта: ${email}\nТекст сообщения: ${text}`,
				html: `
				<html>
				<head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;400;500;700&display=swap"
						rel="stylesheet"
					/>
					<style>
						* {
							box-sizing: border-box;
						}
						body {
							font-family: 'Inter', sans-serif;
							background-color: #f1f1f1;
							padding: 20px;
							background: #fff;
						}
						header {
							background: #404b5a;
							padding: 20px;
							width: 500px;
							margin: 0 auto;
						}
						.Container {
							background: #ebedee;
							padding: 0px 20px 35px 20px;
							width: 500px;
							margin: 0 auto;
						}
						.headerInner img {
							display: inline-block;
							vertical-align: middle;
						}
						.headerInner a {
							padding-left: 10px;
							color: #b1b6bc;
							font-size: 24px;
							text-decoration: none;
							display: inline-block;
							vertical-align: middle;
						}
						.headerInner a:hover {
							color: white;
						}
						p {
							color: #666;
							font-size: 16px;
						}
						.Container {
							text-align: center;
						}
						.Container h1 {
							font-weight: 300;
							font-size: 20px;
							margin: 0;
							padding: 20px 0;
						}
						.ContainerInfo {
							text-align: center;
							padding-bottom: 30px;
						}
						.ContainerInfo span {
							font-weight: 600;
							color: #404b5a;
						}
						.ContainerInfo p {
							margin: 0 0 10px 0;
						}
						.ContainerInfo p:last-child {
							margin: 0;
							padding: 0px;
						}
						.btnSite {
							padding: 10px 20px;
							margin: 10px 20px;
							background: #3ba3f8;
							border-radius: 4px;
							color: #fff;
							font-weight: 600;
							text-decoration: none;
						}
					</style>
				</head>
				<body>
					<header>
						<div class="headerInner">
							<img
								src="https://www.epbusinessjournal.com/wp-content/uploads/2020/11/starbucks-logo-png-transparent.png"
								alt="Epillazer"
								width="40px"
								height="40px"
							/>
							<a href="https://epillazer27.ru">EPILLAZER27.RU</a>
						</div>
					</header>
					<div class="Container">
						<h1>Новая заявка от клиента</h1>
						<div class="ContainerInfo">
							<p>Имя клиента: <span>${name}</span></p>
							<p>Телефон: <span>${phone}</span></p>
							<p>Почта: <span>${email}</span></p>
							<p>Текст сообщения: <span>${text}</span></p>
						</div>
						<div class="btn">
							<a href="https://epillazer27.ru" class="btnSite">Перейти на сайт</a>
						</div>
					</div>
				</body>
			</html>
        `,
			}

			const sendMailPromise = new Promise((resolve, reject) => {
				this.transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						console.error('Ошибка отправки письма:', error)
						reject(error)
					} else {
						console.log('Письмо успешно отправлено:', info.response)
						resolve(info)
					}
				})
			})

			await sendMailPromise
			return { success: true }
		} catch (error) {
			throw new Error('Error sending contact form: ' + error.message)
		}
	}
	async close() {
    await this.db.close();
  }
}

export default FormModel
