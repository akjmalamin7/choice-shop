const router = require('express').Router()
const { createCategory, getCategories } = require('../controllers/categoryControllers')
const admin = require('../middleware/admin')
const authorize = require('../middleware/authorize')

router.post('/',[authorize, admin], createCategory)
router.get('/', getCategories)

module.exports = router