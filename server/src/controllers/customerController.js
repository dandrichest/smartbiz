import Customer from '../models/Customer.js';

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;

  try {
    const customer = await Customer.create({ firstName, lastName, email, phone, address });
    res.status(201).json({ message: 'Customer added successfully', customer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Customer email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const customer = await Customer.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Customer email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully', customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
