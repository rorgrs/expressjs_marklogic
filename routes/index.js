const express = require('express')
const router = express.Router()
const marklogicRoutes = require('./marklogic-routes')

router.use(express.json())

router.use('/api/marklogic', marklogicRoutes)

module.exports = router