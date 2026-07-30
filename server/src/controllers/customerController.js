import Customer from '../models/Customer.js';

// Get all customers for the current user
export const getCustomers = async (req, res) => {
    try {
        console.log('📋 Fetching customers for user:', req.userId);
        const customers = await Customer.find({ createdBy: req.userId }).sort({ createdAt: -1 });
        console.log(`✅ Found ${customers.length} customers`);
        res.json({
            success: true,
            data: customers
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            error: error.message
        });
    }
};

// Get single customer
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({ 
            _id: req.params.id, 
            createdBy: req.userId 
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        res.json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer',
            error: error.message
        });
    }
};

// Create customer
export const createCustomer = async (req, res) => {
    try {
        console.log('📝 Creating customer for user:', req.userId);
        console.log('📝 Customer data:', req.body);

        const { name, email, phone, address } = req.body;

        // Validate
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Customer name is required'
            });
        }

        // Check for duplicate email
        if (email) {
            const existing = await Customer.findOne({ 
                email: email.toLowerCase(), 
                createdBy: req.userId 
            });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer with this email already exists'
                });
            }
        }

        const customer = new Customer({
            name: name.trim(),
            email: email ? email.toLowerCase() : '',
            phone: phone || '',
            address: address || '',
            purchaseCount: 0,
            totalSpent: 0,
            createdBy: req.userId
        });

        await customer.save();
        console.log('✅ Customer created successfully:', customer._id);

        res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            data: customer
        });
    } catch (error) {
        console.error('❌ Error creating customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create customer',
            error: error.message
        });
    }
};

// Update customer
export const updateCustomer = async (req, res) => {
    try {
        console.log('📝 Updating customer:', req.params.id);

        const customer = await Customer.findOne({ 
            _id: req.params.id, 
            createdBy: req.userId 
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        const { name, email, phone, address } = req.body;

        if (name !== undefined) customer.name = name.trim();
        if (email !== undefined) customer.email = email.toLowerCase();
        if (phone !== undefined) customer.phone = phone;
        if (address !== undefined) customer.address = address;

        await customer.save();
        console.log('✅ Customer updated successfully');

        res.json({
            success: true,
            message: 'Customer updated successfully',
            data: customer
        });
    } catch (error) {
        console.error('❌ Error updating customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update customer',
            error: error.message
        });
    }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
    try {
        console.log('🗑️ Deleting customer:', req.params.id);

        const customer = await Customer.findOneAndDelete({ 
            _id: req.params.id, 
            createdBy: req.userId 
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        console.log('✅ Customer deleted successfully');
        res.json({
            success: true,
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete customer',
            error: error.message
        });
    }
};