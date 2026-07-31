import express from 'express';
import Customer from '../models/Customer.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all customers
router.get('/', auth, async (req, res) => {
    try {
        console.log('📋 Fetching customers for user:', req.userId);
        const customers = await Customer.find({ createdBy: req.userId })
            .sort({ createdAt: -1 });
        console.log(`✅ Found ${customers.length} customers`);
        res.json(customers);
    } catch (error) {
        console.error('❌ Error fetching customers:', error);
        res.status(500).json({ 
            message: 'Failed to load customers',
            error: error.message 
        });
    }
});

// GET single customer
router.get('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            createdBy: req.userId
        });

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        res.json(customer);
    } catch (error) {
        console.error('❌ Error fetching customer:', error);
        res.status(500).json({
            message: 'Failed to fetch customer',
            error: error.message
        });
    }
});

// POST create customer
router.post('/', auth, async (req, res) => {
    try {
        console.log('📝 Creating customer for user:', req.userId);
        console.log('📦 Received data:', req.body);

        const { firstName, lastName, email, phone, address } = req.body;

        // Validate required fields
        const errors = [];
        if (!firstName || firstName.trim() === '') {
            errors.push('First name is required');
        }
        if (!lastName || lastName.trim() === '') {
            errors.push('Last name is required');
        }
        if (!email || email.trim() === '') {
            errors.push('Email is required');
        }
        if (!phone || phone.trim() === '') {
            errors.push('Phone number is required');
        }

        if (errors.length > 0) {
            console.log('❌ Validation errors:', errors);
            return res.status(400).json({
                message: errors.join(', ')
            });
        }

        // Check if customer with same email exists for this user
        const existingCustomer = await Customer.findOne({
            email: email.toLowerCase().trim(),
            createdBy: req.userId
        });

        if (existingCustomer) {
            console.log('❌ Customer with email already exists:', email);
            return res.status(400).json({
                message: 'A customer with this email already exists'
            });
        }

        // Create customer
        const customerData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            address: address ? address.trim() : '',
            createdBy: req.userId
        };

        console.log('📦 Creating customer with data:', customerData);

        const customer = new Customer(customerData);
        await customer.save();

        console.log('✅ Customer created successfully:', customer._id);

        res.status(201).json({
            message: 'Customer created successfully',
            customer: customer
        });
    } catch (error) {
        console.error('❌ Error creating customer:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'A customer with this email already exists'
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            message: 'Failed to create customer',
            error: error.message
        });
    }
});

// PUT update customer
router.put('/:id', auth, async (req, res) => {
    try {
        console.log('📝 Updating customer:', req.params.id);
        console.log('📦 Update data:', req.body);

        const { firstName, lastName, email, phone, address } = req.body;

        const customer = await Customer.findOne({
            _id: req.params.id,
            createdBy: req.userId
        });

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        // Check if email is being changed
        if (email && email !== customer.email) {
            const existingCustomer = await Customer.findOne({
                email: email.toLowerCase().trim(),
                createdBy: req.userId,
                _id: { $ne: req.params.id }
            });

            if (existingCustomer) {
                return res.status(400).json({
                    message: 'A customer with this email already exists'
                });
            }
            customer.email = email.toLowerCase().trim();
        }

        // Update fields
        if (firstName) customer.firstName = firstName.trim();
        if (lastName) customer.lastName = lastName.trim();
        if (phone) customer.phone = phone.trim();
        if (address !== undefined) customer.address = address.trim();

        await customer.save();

        console.log('✅ Customer updated successfully:', customer._id);

        res.json({
            message: 'Customer updated successfully',
            customer: customer
        });
    } catch (error) {
        console.error('❌ Error updating customer:', error);
        res.status(500).json({
            message: 'Failed to update customer',
            error: error.message
        });
    }
});

// DELETE customer
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('🗑️ Deleting customer:', req.params.id);

        const customer = await Customer.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.userId
        });

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        console.log('✅ Customer deleted successfully:', req.params.id);

        res.json({
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting customer:', error);
        res.status(500).json({
            message: 'Failed to delete customer',
            error: error.message
        });
    }
});

export default router;