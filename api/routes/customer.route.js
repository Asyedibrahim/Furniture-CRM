import express from 'express';
import { addCustomer, getAllCustomers, deleteCustomer, getCustomer, updateCustomer } from '../controllers/customer.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/add-customer', verifyToken, addCustomer);
router.get('/get-customers', verifyToken, getAllCustomers);
router.delete('/delete-customer/:cusId', verifyToken, deleteCustomer);
router.get('/getCustomer/:cusId', verifyToken, getCustomer);
router.put('/update-customer/:cusId', verifyToken, updateCustomer);

export default router;