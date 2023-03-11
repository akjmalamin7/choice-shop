const _ = require('lodash')
const formidable = require('formidable')
const fs = require('fs')
const { Product, validate } = require('../models/product')

module.exports.createProduct = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something went wrong!")

        const { error } = validate(_.pick(fields, ["name", "description", "price", "category", "quantity"]))
        if (error) return res.status(400).send(error.details[0].message)

        const product = new Product(fields)

        if (files.photo) {
            fs.readFile(files.photo.filepath, async (err, data) => {
                if (err) return res.status(400).send("Problem in file data!")

                product.photo.data = data
                product.photo.contentType = files.photo.type

                let response = await product.save();

                if (response._id) {
                    return res.status(201).send({
                        message: "Product created successfully!",
                        data: _.pick(fields, ["name", "description", "price", "category", "quantity"])
                    })
                } else {
                    return res.status(500).send("Internal server error!")
                }
            })
        } else {
            return res.status(400).send("No image provided!")
        }
    })
}
module.exports.getProducts = async (req, res) => {

    let order = req.query.order === 'desc' ? -1 : 1
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    let limit = req.query.limit ? parseInt(req.query.limit) : 10
    const product = await Product.find()
        .select({ photo: 0 })
        .sort({ [sortBy]: order })
        .populate("category", "name")
        .limit(limit)
    return res.status(200).send(product)
}
module.exports.getProductById = async (req, res) => {
    const productId = req.params.id
    const product = await Product.findById(productId)
        .select({ photo: 0 })
        .populate("category", "name")

    if (!product) return res.status(404).send("Not found!")
    return res.status(200).send(product)
}

module.exports.getPhoto = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
        .select({ photo: 1, _id: 0 })
    res.set('Content-Type', product.photo.contentType)
    return res.status(200).send(product.photo.data);
}
module.exports.updateProductById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (fields, files) => {
        if (err) return res.status(400).send("Something went wrong!")
        const updateFields = _.pick(fields, ["name", "description", "price", "category", "quantity"])
        _.assignIn(product, updateFields)

        if (files.photo) {
            fs.readFile(files.photo.filepath, async (err, data) => {
                if (err) return res.status(400).send("Problem in file data!")

                product.photo.data = data
                product.photo.contentType = files.photo.type

                let response = await product.save();

                if (response._id) {
                    return res.status(201).send({
                        message: "Product updated successfully!",
                        data: _.pick(fields, ["name", "description", "price", "category", "quantity"])
                    })
                } else {
                    return res.status(500).send("Internal server error!")
                }
            })
        } else {
            return res.status(400).send("No image provided!")
        }
    })
}

const body = {
    order: 'desc',
    sortBy: 'price',
    limit: 6,
    skip: 20,
    filters: {
        price: [1000, 10000],
        category: ["sdf9908098090sdf", "sd55908098090sdf"]
    }
}
module.exports.filterProduct = async (req, res) => {
   
    let order = req.body.order === 'desc' ? -1 : 1
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id"
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let skip = parseInt(req.body.skip)
    let filters = req.body.filters;
    let args = {}
    
    for (let key in filters) {
        if (filters[key].length > 0) {
            if (key === 'price') {
                args['price'] = {
                    $gte: filters['price'][0],
                    $lte: filters['price'][1],
                }
            }
            if (key === 'category') {
                args['category'] = {
                    $in: filters['category']
                }
                console.log(args)
            }
        }

    }
    

    const products = await Product.find(args)
        .select({ photo: 0 })
        .populate('category', 'name')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)

    return res.status(200).send(products)
}