import express from "express";
import products from "./products.js"
import users from "./users.js"
import auth from "./auth.js"

var router = express.Router();
router.use('/products', products)
router.use('/auth', auth)
router.use('/user', users)
/* GET home page. */

export default router
