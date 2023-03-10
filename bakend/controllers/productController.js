const _ = require('lodash')
const fs = require('fs')
const { Product, validate } = require('../models/product')
const formidable = require('formidable')
const { result } = require('lodash')

module.exports.createProduct = async(req, res) =>{
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=>{
        if(err) return res.status(400).send("Something went wrong!")

        const {error} = validate(_.pick(fields, ["name", "description", "price", "category", "quantity"]))
        if(error) return res.status(400).send(error.details[0].message)

        const product = new Product(fields)

        if(files.photo){
            fs.readFile(files.photo.path, (err, data)=>{
                if(err) return res.status(400).send("Problem in file data!")

                product.photo.data = data
                product.contentType = files.photo.type 

                product.save((err, result)=>{
                    if(err) return res.status(500).send("Internal server error!")
                    else return res.status(201).send({
                        message:"Product created successfully!",
                        data: _pick(result, ["name", "description", "price", "category", "quantity"])
                    })
                })
            })
        }else{
            return res.status(400).send("No image provided!")
        }
    })
}
module.exports.getProducts = async(req, res) =>{

}
module.exports.getProductById = async(req, res) =>{

}
module.exports.updateProductById = async(req, res) =>{

}