import db from '../config/config.js';
import { errorHandler } from '../utils/error.js';

export const getMonthlyReport = async (req, res, next) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return next(errorHandler(400, 'Both month and year are required'));
    }

    const query = `
        SELECT c.id, c.name, c.phone, COUNT(b.billId) AS purchase_count
        FROM bills b
        JOIN customers c ON b.customerId = c.id
        WHERE MONTH(b.billDate) = ? AND YEAR(b.billDate) = ?
        GROUP BY c.id, c.name, c.phone;
    `;

    try {
        db.query(query, [month, year], (error, results) => {
            if (error) {
                return next(error);
            }
            res.json(results);
        });
    } catch (error) {
        next(error);
    }
};



export const getYearlyReport = async (req, res, next) => {
    const { year } = req.query;
    const query = `
        SELECT c.id, c.name, c.phone, COUNT(b.billId) AS purchase_count
        FROM bills b
        JOIN customers c ON b.customerId = c.id
        WHERE YEAR(b.billDate) = ?
        GROUP BY c.id, c.name, c.phone;
    `;

    try {
        db.query(query, [ year ], (error, results) => {
            if (error) {
                return next(error); 
            }
            res.json(results); 
        });
    } catch (error) {
        next(error);
    }
};