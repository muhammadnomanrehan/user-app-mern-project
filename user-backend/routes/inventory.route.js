



// import { Router } from "express";
// import {
//   createItem,
//   getItems,
//   getItemById,
//   updateItem,
//   deleteItem,
//   checkItemCode,
// } from "../controllers/inventory.controller.js";
// // import auth from "../middlewares/auth.middleware.js"; // if you already use auth

// const router = Router();

// // Sir ne kaha abhi simple rakho → so no role-based check
// // router.use(auth);

// // Simple CRUD Routes
// router.post("/items", createItem);          // create
// router.get("/items", getItems);             // list
// router.get("/items/check-code", checkItemCode); // duplicate check
// router.get("/items/:id", getItemById);      // read one
// router.put("/items/:id", updateItem);       // update
// router.delete("/items/:id", deleteItem);    // delete (optional)

// export default router;




import { Router } from 'express';

import { upload } from '../middlewares/upload.middleware.js';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  checkItemCode,
} from '../controllers/inventory.controller.js';

const router = Router();

// image field name must be "image"
router.post('/items', upload.single('image'), createItem);
router.get('/items', getItems);
router.get('/items/check-code', checkItemCode);
router.get('/items/:id', getItemById);
router.put('/items/:id', upload.single('image'), updateItem);
router.delete('/items/:id', deleteItem);

export default router;