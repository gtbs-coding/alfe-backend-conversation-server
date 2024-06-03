/** @format */

// * server.ts
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import router from './routes/router'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'
// import { checkIfAuthenticated } from './middleware/auth/authMiddleware.js'

// console.log('checkIfAuthenticated', checkIfAuthenticated)

// todo: Comment following 2 lines before deploy in prod mode!!!
// import dotenv from 'dotenv'
// dotenv.config()
// todo --------------------------------------------------------
import logger from 'morgan'

export const initServer = () => {
	console.log('initServer is fired')
	const app = express()
	const whitelist: any[] = [
		process.env.THE_FRONTEND_URL,
		process.env.THE_FRONTEND_DIGITAL_OCEAN_URL,
		process.env.THE_FRONTEND_DIGITAL_OCEAN_SECOND_URL,
	]
	if (process.env.THE_ENVIRONMENT === 'development') {
		whitelist.push(process.env.THE_FRONTEND_LOCAL_URL)
	}
	app.use(
		cors({
			origin: whitelist,
			credentials: true,
		}),
	)
	function validateTheEmail(req: Request, res: Response, next: NextFunction) {
		console.log('validateTheEmail is fired')
		const { email } = req.body
		if (req.url === '/api') {
			next()
		} else if (
			email === process.env.THE_EMAIL_ALFE ||
			email === process.env.THE_EMAIL_ODOR ||
			email === process.env.THE_EMAIL_SCANDINAVIA ||
			email === process.env.THE_EMAIL_SYMBOL
		) {
			res.locals.email = email
			next()
		} else {
			res.status(400).send({
				error: {
					message: 'Unauthorized request!!!',
				},
			})
		}
	}

	app.use(helmet())
	app.use(fileUpload())
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(logger('dev'))
	// app.use(checkIfAuthenticated)
	app.use(validateTheEmail)
	app.use('/', router)

	const port = process.env.PORT || 9000
	app.listen(port, () => {
		console.log(`app is live on ${port}`)
	})
}

export default initServer
