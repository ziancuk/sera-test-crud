import products from '../models/Products.js'

const store = async (req, res) => {
    try{

        if(!req.body.title) { throw { code: 428, message: "Title is required"}}
        if(!req.body.description) { throw { code: 428, message: "Description is required"}}
        if(!req.body.price) { throw { code: 428, message: "Price is required"}}
        
        const productExist = await products.findOne({ title: req.body.title})
        if(productExist) { throw { code: 428, message: "Product is exist"}}

        const title = req.body.title;
        const description = req.body.description;
        const price = req.body.price;

        const newProduct = new products({
            title: title,
            description: description,
            price: price,
        })

        const Products = await newProduct.save()

        if(!Products) { throw { code: 500, message: "Store product failed" } }

        return res.status(200).json({
            code: 200,
            message: 'SUCCESS',
            data: Products
        });
    } catch(err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

const list = async (req, res) => {
    try{
        const searchCondition = req.query.search
        ? { title: { $regex: req.query.search, $options: 'i' } }
        : {};
        const active = { status:'active' }

        const product = await products.find({
            $and: [
                active,
                searchCondition
            ]})
        .skip(req.query.skip)
        .limit(req.query.take)
        
        if(!product) { throw { code: 200, message: 'Get Products faled' } }
        
        return res.status(200).json({
            code: 200,
            message: 'SUCCESS',
            data: product
        });

    } catch(err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

const destroy = async (req, res) => {
    try{

        if(!req.params.id) { throw { code: 428, message: "ID is required"}}

        let fields = {}
        fields.status = 'inactive';

        const Product = await products.findByIdAndUpdate(req.params.id, fields, { new : true });
        if(!Product) { throw { code: 500, message: "PRODUCT_DELETE_FAILED" } }

        return res.status(200).json({
            code: 200,
            message: 'PRODUCT_DELETE_SUCCESS',
            data: Product
        });
    } catch(err) {
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

const update = async (req, res) => {
    try{

        if(!req.body.title) { throw { code: 428, message: "Title is required"}}
        if(!req.body.description) { throw { code: 428, message: "Description is required"}}
        if(!req.body.price) { throw { code: 428, message: "Price is required"}}

        if(req.body.password !== req.body.password_confirmation) {
            throw { code: 428, message: "Password do not match"}
        }

        let fields = {}
        fields.title = req.body.title;
        fields.description = req.body.description;
        fields.price = req.body.price;

        const Product = await products.findByIdAndUpdate(req.params.id, fields, { new : true });

        if(!Product) { throw { code: 500, message: "PRODUCT_UPDATE_FAILED" } }

        return res.status(200).json({
            code: 200, 
            message: 'PRODUCT_UPDATE_SUCCESS',
            data: Product
        });
    } catch(err) {
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

const show = async (req, res) => {
    try{
        if(!req.params.id) { throw { code: 428, message: 'ID is Required' } }

        const Product = await products.findById(req.params.id)
        if(!Product) { throw { code: 404, message: 'Product Not Found' } }

        return res.status(200).json({
            code: 200,
            message: 'Success', 
            data: Product
        });

    } catch(err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

export default { store, list, destroy, update, show }