/** @format */

import express, { Request, Response, NextFunction } from 'express'

// todo: Comment following 2 lines before deploy in prod mode!!!
import dotenv from 'dotenv'
dotenv.config()
// todo --------------------------------------------------------

import QRCode from 'qrcode'
const sendToCustomerInvoiceRouter = express.Router()
import nodemailer from 'nodemailer'

// ? import { writeFile } from 'fs/promises'
import fs from 'fs'

// *** alfemailapi
const transport = {
	host: 'smtp.sendgrid.net',
	port: 465,
	secure: true,
	auth: {
		user: process.env.THE_USER,
		pass: process.env.THE_PASSWORD,
	},
}

const transporter = nodemailer.createTransport(transport)
transporter.verify((error, success) => {
	if (error) {
		// ? if error happened code ends here
		console.log("Error: transporter couldn't be verified")
		console.error(error)
	} else {
		// ? this means success
		console.log('Success: transporter is created', success)
	}
})
// ** --------------------------------------------------------------
async function writeToFile(qrString: string) {
	try {
		let qrCodeRaw = await QRCode.toDataURL(qrString)
		let qrCode = await qrCodeRaw.slice(22)
		// ! Convert base64 to buffer => <Buffer ff d8 ff db 00 43 00 ...
		const buffer = Buffer.from(qrCode, 'base64')
		// ! Pipes an image with “new-path.jpg” as the name.
		fs.writeFileSync('./src/routes/node-mail/qr-code/img.jpg', buffer)
	} catch (error: any) {
		console.error(`Got an error trying to write the file: ${error.message}`)
	}
}

sendToCustomerInvoiceRouter.post(
	'/',
	async (req: Request | any, res: Response, next: NextFunction) => {
		writeToFile(req.body.qrString)
		console.log('sendToCustomerInvoiceRouter post request')
		// * make mailable object
		const contentText = `
Från: ${req.body.ourCompany}
Vår Ref: ${req.body.reference}
${req.body.ourMail}  ${req.body.tel}

Fakturanummer: ${req.body.invoiceNumber}
${req.body.relatedDocuments}

Att Betala: ${req.body.toPay}
Förfallodatum: ${req.body.invoiceDueDate}
Betala till Bankgiro: ${req.body.bg}
Meddelande: ${req.body.slicedOcr}

${req.body.message}

---------------------------------------
 Powered by GTBS CRM
 This email is created automatically by
 © GTBS CRM Application
---------------------------------------
`
		const contentHtml = `
	<div style="color: beige; background-color: #414445; padding: 20px;">
		<p>
			Från: ${req.body.ourCompany}  via GTBS-CRM App<br> 
			Vår Ref: ${req.body.reference} <br>
			${req.body.ourMail}  ${req.body.tel} <br>
			<br>
			Fakturanummer: ${req.body.invoiceNumber} <br>
			${req.body.relatedDocuments} <br>
			<br>
		</p> 
		<p style="color: #323232; background-color: #dedede; width: 400px; padding: 10px;">
			<span style="color: red;">Att Betala: </span>${req.body.toPay} <br>
			<span style="color: red;">Förfallodatum: </span>${req.body.invoiceDueDate} <br>
			<span style="color: red;">Betala till Bankgiro: </span>${req.body.bg} <br>
			<span style="color: red;">Meddelande: </span>${req.body.slicedOcr} <br>
		</p>
		<br><br>
		<p>Skanna och Betala med QR Koden</p>
		<p style= width="120px;">
		  <img src="cid:unique@nodemailer.com" alt="QR Code" />
		</p>
		<p>
			${req.body.message} <br>
		</p>
		<br>
		<br>
		<p style="color: #F5969E; background-color: #981C1E; width: 400px; padding: 10px;">
			Powered by GTBS CRM <br>
			This email is created automatically by<br>
			© GTBS CRM Application
		</p>
	</div>
	`
		// * ---------------------------------------------------------------------

		interface Mail {
			from: string
			sender: string
			to: string
			bcc: string | undefined
			replyTo: string | undefined
			subject: string
			priority: 'high' | 'normal' | 'low' | undefined
			text: string
			html: string
			attachments: any[]
		}
		const fromField = `${req.body.ourCompany} - "Finans Avdelning"`
		const mail: Mail = {
			from: `${fromField} ${res.locals.email}`,
			sender: req.body.email,
			to: req.body.customerMail,
			bcc: req.body.bcc,
			replyTo: req.body.email,
			subject: `${req.body.subject} ${req.body.invoiceNumber}, Förfallodatum: ${req.body.invoiceDueDate}, Att betala: ${req.body.toPay}`,
			priority: 'high',
			text: contentText,
			html: contentHtml,
			attachments: [
				{
					// todo stream as an attachment
					filename: `${req.body.fileName}.pdf`,
					content: req?.files?.pdfFileStream.data,
				},
				{
					filename: 'img.jpg',
					path: './src/routes/node-mail/qr-code/img.jpg',
					cid: 'unique@nodemailer.com', // ** same cid value as in the html img src
				},
			],
		}
		// * error handling goes here.
		transporter.sendMail(mail, (err, data) => {
			if (err) {
				console.log('transporter err: ', err)
				res.json({
					status: 'Error: transporter sendMail is failed',
					error: err,
				})
			} else {
				res.json({
					status: 'Success: The email is successfully sent to the client',
				})
			}
		})
	},
)
export default sendToCustomerInvoiceRouter
