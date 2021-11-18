const express = require("express");
const router = express.Router();
const todo_controller = require("../controller/todo_controller");

router.get("/", todo_controller.userAuth, todo_controller.getList);

router.post("/", todo_controller.userAuth, todo_controller.addList);

router.delete("/:item_id", todo_controller.userAuth, todo_controller.removeList);

router.post("/update/:item_id", todo_controller.userAuth, todo_controller.updateList);

router.post("/login", todo_controller.userLogin);

router.post("/auth", todo_controller.userAuth, todo_controller.userAuth);


module.exports = router;