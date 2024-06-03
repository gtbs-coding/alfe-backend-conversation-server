/** @format */

import express, { Response } from 'express'
const apiRouter = express.Router()

const message = `
<h1 style="color: green; margin-top: 2em; text-align: center;">
GTBS mail server is up and running
</h1>
`

apiRouter.get('/', (_, res: Response) => {
	res.status(200).send(message)
})

export default apiRouter
