import Product from "../models/Product.js";
import cloudinary from "../middleware/cloudinary.js";

//Helper function for uploading images. Only upload if it's a fresh base64 image from the file picker.
// If it's already an https:// URL (unchanged on edit, or pasted URL), leave it as-is.
const uploadImageIfNeeded = async (image) => {
    if (!image) return '';

    if (image.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(image, {
            folder: 'smartbiz-products',
            transformation: [{ width: 400, height: 400, crop: 'limit' }],
        });
        return result.secure_url;
    }
    return image;
};

// Get all products for the current user
export const getProducts = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        const products = await Product.find({ createdBy: userId }).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

// Get single product
export const getProductById = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        const product = await Product.findOne({
            _id: req.params.id,
            createdBy: userId
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
};

// Create product (full featured)
export const createProduct = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const {
            name,
            description,
            price,
            costPrice,
            stockQuantity,
            category,
            sku,
            image,
            minStock
        } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Product name is required'
            });
        }

        if (price === undefined || price === null || parseFloat(price) < 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid price is required'
            });
        }

        if (stockQuantity === undefined || stockQuantity === null || parseInt(stockQuantity) < 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid stock quantity is required'
            });
        }
        
        const imageUrl = await uploadImageIfNeeded(image);
        const productData = {
            name: name.trim(),
            description: description ? description.trim() : '',
            price: parseFloat(price),
            costPrice: costPrice ? parseFloat(costPrice) : parseFloat(price) * 0.7,
            stockQuantity: parseInt(stockQuantity),
            category: category ? category.trim() : 'Uncategorized',
            sku: sku ? sku.trim() : '',
            image: imageUrl,
            minStock: minStock ? parseInt(minStock) : 10,
            createdBy: userId
        };
       

        const product = new Product(productData);
        await product.save();        

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Product with this SKU already exists'
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// Update product (full featured)
export const updateProduct = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        const product = await Product.findOne({
            _id: req.params.id,
            createdBy: userId
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const {
            name,
            description,
            price,
            stockQuantity,
            category,
            sku,
            costPrice,
            minStock,
            image
        } = req.body;

        if (name !== undefined) product.name = name.trim() || product.name;
        if (description !== undefined) product.description = description.trim() || '';
        if (price !== undefined && !isNaN(price) && price >= 0) product.price = Number(price);
        if (stockQuantity !== undefined && !isNaN(stockQuantity) && stockQuantity >= 0) {
            product.stockQuantity = Number(stockQuantity);
        }
        if (costPrice !== undefined && !isNaN(costPrice) && costPrice >= 0) {
            product.costPrice = Number(costPrice);
        }
        if (minStock !== undefined && !isNaN(minStock) && minStock >= 0) {
            product.minStock = Number(minStock);
        }
        if (category !== undefined) product.category = category.trim() || 'Uncategorized';
        if (sku !== undefined) product.sku = sku.trim() || '';
        if (image !== undefined) {
            product.image = await uploadImageIfNeeded(image);
        }

        await product.save();

        console.log('Product updated successfully');

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        console.log('Deleting product:', req.params.id);

        const userId = req.userId || req.user?.id;
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            createdBy: userId
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('Product deleted successfully');

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};
