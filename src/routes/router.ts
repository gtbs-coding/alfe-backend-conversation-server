/**
 * router.ts by Vedat Erenoglu
 *
 * @format
 */

// ? we import the express from our node modules and set our router 
// ? to being the Router method on our imported express class

import express from 'express'
let router = express.Router()

// ** mode-mail routers
// import sendToCustomerRouter from './node-mail/sendToCustomer.js'
// router.use('/send-to-customer', sendToCustomerRouter)

import sendToCustomerInvoiceRouter from './node-mail/sendToCustomerInvoice'
router.use('/send-to-customer-invoice', sendToCustomerInvoiceRouter)

import sendToCustomerReminderRouter from './node-mail/sendToCustomerReminder'
router.use('/send-to-customer-reminder', sendToCustomerReminderRouter)

import apiRouter from './shared/api'
router.use('/api', apiRouter)

router.all('*', (req, res) => {
  res.status(404).send({
        error: {
            message: 'Not found!',
        },
    })
})

export default router
