import db from '../config/config.js';
import { errorHandler } from '../utils/error.js';

export const addCustomer = async (req, res, next) => {
    const { name, phone, street, area, pincode, bills } = req.body;

    // Start the transaction
    db.beginTransaction((err) => {
        if (err) {
            return next(errorHandler(500, 'Error starting transaction'));
        };

        // Insert customer data
        const customerQuery = 'INSERT INTO customers (name, phone, street, area, pincode) VALUES (?,?,?,?,?)';
        db.query(customerQuery, [name, phone, street, area, pincode], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    next(errorHandler(500, 'Error adding customer'));
                });
            };

            const customerId = result.insertId;
            const billData = bills.map(bill => [customerId, bill.billNo, bill.amount, bill.date]);

            // Insert bills data
            const billQuery = 'INSERT INTO bills (customerId, billNo, amount, billDate) VALUES ?';
            db.query(billQuery, [billData], (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return db.rollback(() => {
                            next(errorHandler(409, 'Duplicate bill no'));
                        });
                    } else {
                        return db.rollback(() => {
                            next(errorHandler(500, 'Error adding bills'));
                        });
                    };
                };

                // If everything is successful, commit the transaction
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            next(errorHandler(500, 'Error committing transaction'));
                        });
                    };
                    res.status(200).json('Customer and bills data added successfully');
                });
            });
        });
    });
};

export const getAllCustomers = async (req, res, next) => {

    db.query('SELECT * FROM customers', (err, customers) => {
        if (err) {
            return next(err);
        }

        if (customers.length === 0) {
            return res.status(200).json([]);
        }

        // Function to get bills for a specific customer
        const getBillsForCustomer = (customer) => {

            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM bills WHERE customerId = ?', [customer.id], (err, bills) => {
                    if (err) {
                        return reject(err);
                    }
                    
                    customer.bills = bills.length > 0 ? bills : [];
                    resolve(customer);
                });
            });
        };

        // Fetch bills for each customer
        Promise.all(customers.map(getBillsForCustomer)).then((results) => {
            res.status(200).json(results);  // Send the combined data back
        }).catch((error) => {
            next(error);
        });
    });
};

export const deleteCustomer = async (req, res, next) => {

    if (!req.user || req.user.isAdmin === 0) {
        return next(errorHandler(403, 'You are not allowed to delete the customer'));
    }

    db.query('DELETE FROM customers WHERE id = ?', [req.params.cusId], (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(200).json('Customer has been deleted!')
        }
    });
};

export const getCustomer = async (req, res, next) => {

    if (!req.user || req.user.isAdmin === 0) {
        return next(errorHandler(403, 'You are not allowed to delete the customer'));
    }

    db.query('SELECT * FROM customers WHERE id = ?', [req.params.cusId], (err, customers) => {
        if (err) {
            return next(err)
        }

        if (customers.length === 0) {
            return res.status(404).json({ message: 'Customer not found!' });
        }

        const customer = customers[0];
        
        db.query('SELECT * FROM bills WHERE customerId = ?', [customer.id], (err, bills) => {
            if (err) {
                return next(err)
            }

            const customerData = {
                ...customer,
                bills: bills.length > 0 ? bills : []
            }
            res.status(200).json(customerData);
        });
    })
};

export const updateCustomer = async (req, res, next) => {
    if (!req.user || req.user.isAdmin === 0) {
        return next(errorHandler(403, 'You are not allowed to update the customer'));
    }

    const { name, phone, street, area, pincode, bills } = req.body;

    try {
        // Fetch existing customer data
        const [customers] = await db.promise().query('SELECT * FROM customers WHERE id = ?', [req.params.cusId]);

        if (customers.length === 0) {
            return res.status(404).json({ message: 'Customer not found!' });
        }

        const existingCustomer = customers[0];

        // Update customer details or keep existing values if not provided
        const updatedName = name || existingCustomer.name;
        const updatedPhone = phone || existingCustomer.phone;
        const updatedStreet = street || existingCustomer.street;
        const updatedArea = area || existingCustomer.area;
        const updatedPincode = pincode || existingCustomer.pincode;

        // Update customer query
        const updateCustomerQuery = `
            UPDATE customers 
            SET name = ?, phone = ?, street = ?, area = ?, pincode = ?
            WHERE id = ?`;

        await db.promise().query(updateCustomerQuery, [updatedName, updatedPhone, updatedStreet, updatedArea, updatedPincode, req.params.cusId]);

        if (bills && bills.length > 0) {
            for (let bill of bills) {
                const { billId, billNo, amount, date } = bill;

                if (billId) {
                    // Update existing bill
                    const [existingBills] = await db.promise().query(`
                        SELECT * FROM bills 
                        WHERE BillId = ? AND customerId = ?`, [billId, req.params.cusId]);

                    if (existingBills.length === 0) {
                        return next(errorHandler(404, 'Existing bill not found'));
                    }

                    const existingBill = existingBills[0];
                    const updatedDate = date || existingBill.billDate;

                    await db.promise().query(`
                        UPDATE bills 
                        SET billNo = ?, amount = ?, billDate = ?
                        WHERE BillId = ? AND customerId = ?`, [billNo, amount, updatedDate, billId, req.params.cusId]);

                } else {
                    // Check for duplicate billNo
                    const [existingBills] = await db.promise().query(`
                        SELECT * FROM bills 
                        WHERE billNo = ? AND customerId = ?`, [billNo, req.params.cusId]);

                    if (existingBills.length > 0) {
                        const existingBill = existingBills[0];
                        const updatedDate = date || existingBill.billDate;

                        await db.promise().query(`
                            UPDATE bills 
                            SET amount = ?, billDate = ?
                            WHERE BillId = ?`, [amount, updatedDate, existingBill.BillId]);
                    } else {
                        // Insert new bill
                        if (!billNo || !amount || !date) {
                            return next(errorHandler(400, 'Missing required bill fields'));
                        }

                        await db.promise().query(`
                            INSERT INTO bills (customerId, billNo, amount, billDate) 
                            VALUES (?, ?, ?, ?)`, [req.params.cusId, billNo, amount, date]);
                    }
                }
            }
        }

        res.status(200).json('Customer and bills details updated successfully');
    } catch (err) {
        return next(err);
    }
};
