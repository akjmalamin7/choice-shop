const router = require('express').Router()
const {
    createProduct,
    getProducts,
    getProductById,
    updateProductById
} = require('../controllers/productController')
const admin = require('../middleware/admin')
const authorize = require('../middleware/authorize')


router.post('/', [authorize, admin], createProduct)
router.get('/', getProducts)

router.get('/:id', getProductById)
router.put('/:id', updateProductById)

module.exports = router