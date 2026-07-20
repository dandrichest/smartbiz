import Customer from '../models/Customer.js';

// Get all customers
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: customers.length,
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

// Get single customer by ID
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
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

// Create new customer
export const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        
        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: 'Customer with this email already exists'
            });
        }

        const customer = new Customer({
            name,
            email,
            phone,
            address,
            purchaseCount: 0,
            totalSpent: 0
        });

        await customer.save();
        res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            data: customer
        });
    } catch (error) {
        console.error('Error creating customer:', error);
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
        const { name, email, phone, address } = req.body;
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        res.json({
            success: true,
            message: 'Customer updated successfully',
            data: customer
        });
    } catch (error) {
        console.error('Error updating customer:', error);
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
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        res.json({
            success: true,
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete customer',
            error: error.message
        });
    }
};

// Get customer purchase history
export const getCustomerPurchaseHistory = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .populate('purchases');
        
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        res.json({
            success: true,
            data: {
                customer: customer.name,
                email: customer.email,
                phone: customer.phone,
                purchaseCount: customer.purchaseCount,
                totalSpent: customer.totalSpent,
                purchases: customer.purchases || []
            }
        });
    } catch (error) {
        console.error('Error fetching customer history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer history',
            error: error.message
        });
    }
};