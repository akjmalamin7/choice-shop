const router = require('express').Router()
const {
    createCartItem,
    getCartItem,
    updateCartItem,
    deleteCartItem

} = require('../controllers/cartRouter')
const admin = require('../middleware/admin')
const authorize = require('../middleware/authorize')


router.post('/', [authorize, admin], createProduct)
router.get('/', getProducts)

router.get('/:id', getProductById)
router.put('/:id', [authorize, admin], updateProductById)
router.get('/photo/:id', getPhoto)
router.post('/filter', filterProduct)

module.exports = router
