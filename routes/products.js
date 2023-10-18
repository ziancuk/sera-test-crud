import express from "express";
import productsController from '../controllers/ProductController.js'
import jwtAuth from "../middlewares/authJwt.js";
import role from "../middlewares/role.js";

var router = express.Router();

/* GET home page. */
router.get('/', [jwtAuth(), role('admin', 'user')], productsController.list)
router.post('/', [jwtAuth(), role('admin')], productsController.store)
router.put('/:id',[jwtAuth(), role('admin')], productsController.update)
router.get('/:id',[jwtAuth(), role('admin')], productsController.show)
router.delete('/:id',[jwtAuth(), role('admin')], productsController.destroy)

export default router
