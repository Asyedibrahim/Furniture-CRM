import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getMonthlyReport, getYearlyReport } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/monthly-purchases', verifyToken, getMonthlyReport);
router.get('/yearly-purchases', verifyToken, getYearlyReport);

export default router;