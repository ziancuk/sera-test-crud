import express from "express";
import userControler from '../controllers/UserController.js'
import jwtAuth from "../middlewares/authJwt.js";
import role from "../middlewares/role.js";

var router = express.Router();

/* GET home page. */
router.get('/',[jwtAuth(), role('admin')], userControler.index)
router.post('/',[jwtAuth(), role('admin')], userControler.store)
router.put('/:id',[jwtAuth(), role('admin')], userControler.update)
router.get('/:id',[jwtAuth(), role('admin')], userControler.show)
router.delete('/:id',[jwtAuth(), role('admin')], userControler.destroy)

export default router
