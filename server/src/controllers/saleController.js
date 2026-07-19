import { validationResult } from 'express-validator';
import Sale from '../models/Sale.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';

export const getSalesHistory = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('customer', 'firstName lastName email phone')
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .sort({ dateOfSale: -1 });

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const recordSale = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { customerId, productId, quantitySold, paymentMethod } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantitySold <= 0) {
      return res.status(400).json({ message: 'Quantity sold must be greater than zero' });
    }

    if (product.quantity < quantitySold) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.quantity -= quantitySold;
    await product.save();

    const sale = await Sale.create({
      customer: customer._id,
      user: req.user?.id,
      products: [
        {
          product: product._id,
          quantity: quantitySold,
          price: product.price,
        },
      ],
      paymentMethod: paymentMethod || 'cash',
      totalAmount: product.price * quantitySold,
    });

    res.status(201).json({ message: 'Sale recorded successfully', sale });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
