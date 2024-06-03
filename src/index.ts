/** @format */
import initServer from './server'

// todo: Comment following 5 lines before deploy in prod mode!!!

// import dotenv from 'dotenv'
// const result = dotenv.config()

// if (result.error) {
// 	throw result.error
// }

// todo --------------------------------------------------------

// * Production check environments variables
if (
	process.env.THE_EMAIL_ALFE &&
	process.env.THE_EMAIL_ODOR &&
	process.env.THE_EMAIL_SCANDINAVIA &&
	process.env.THE_EMAIL_SYMBOL &&
	process.env.THE_USER &&
	process.env.THE_PASSWORD &&
	process.env.THE_INCOMING_EMAIL_ACCOUNT &&
	process.env.THE_FRONTEND_URL &&
	process.env.THE_FRONTEND_DIGITAL_OCEAN_URL &&
	// process.env.THE_FRONTEND_DIGITAL_OCEAN_SECOND_URL &&
	process.env.THE_FRONTEND_LOCAL_URL &&
	process.env.THE_ENVIRONMENT
) {
	initServer()
}
