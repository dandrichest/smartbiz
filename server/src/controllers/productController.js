import Product from '../models/Product.js';

// Get all products for the current user
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ createdBy: req.userId }).sort({ createdAt: -1 });
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
        const product = await Product.findOne({ 
            _id: req.params.id, 
            createdBy: req.userId 
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

// Create product
export const createProduct = async (req, res) => {
    try {
        console.log('📦 Creating product for user:', req.userId);
        console.log('📦 Request body:', JSON.stringify(req.body, null, 2));

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

        // Log each field
        console.log('📝 Parsed fields:');
        console.log('  - name:', name, '| type:', typeof name);
        console.log('  - price:', price, '| type:', typeof price);
        console.log('  - stockQuantity:', stockQuantity, '| type:', typeof stockQuantity);
        console.log('  - costPrice:', costPrice, '| type:', typeof costPrice);
        console.log('  - minStock:', minStock, '| type:', typeof minStock);
        console.log('  - category:', category, '| type:', typeof category);
        console.log('  - sku:', sku, '| type:', typeof sku);
        console.log('  - description:', description, '| type:', typeof description);
        console.log('  - image:', image ? 'present' : 'absent');

        // Validate
        if (!name || name.trim() === '') {
            console.log('❌ Validation failed: name is required');
            return res.status(400).json({
                success: false,
                message: 'Product name is required'
            });
        }

        if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
            console.log('❌ Validation failed: invalid price');
            return res.status(400).json({
                success: false,
                message: 'Valid price is required'
            });
        }

        if (stockQuantity === undefined || stockQuantity === null || isNaN(stockQuantity) || Number(stockQuantity) < 0) {
            console.log('❌ Validation failed: invalid stock quantity');
            return res.status(400).json({
                success: false,
                message: 'Valid stock quantity is required'
            });
        }

        // Ensure user ID exists
        if (!req.userId) {
            console.log('❌ No user ID found!');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Prepare product data
        const productData = {
            name: name.trim(),
            description: description ? description.trim() : '',
            price: Number(price),
            costPrice: Number(costPrice || price * 0.7),
            stockQuantity: Number(stockQuantity),
            minStock: Number(minStock || 10),
            category: category ? category.trim() : 'Uncategorized',
            sku: sku ? sku.trim() : '',
            image: image || '',
            createdBy: req.userId
        };

        console.log('📦 Final product data:', JSON.stringify(productData, null, 2));

        // Create and save
        const product = new Product(productData);
        console.log('📦 Product instance created, attempting to save...');
        
        await product.save();
        
        console.log('✅ Product created successfully! ID:', product._id);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('❌ Error creating product:', error);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        // Handle specific error types
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            console.log('❌ Validation errors:', messages);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        if (error.code === 11000) {
            console.log('❌ Duplicate key error');
            return res.status(400).json({
                success: false,
                message: 'Product with this SKU already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        console.log('📝 Updating product:', req.params.id);

        const product = await Product.findOne({ 
            _id: req.params.id, 
            createdBy: req.userId 
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
        if (image !== undefined) product.image = image || '';

        // Update low stock alert flag
        product.handleLowStockAlert();

        await product.save();

        console.log('✅ Product updated successfully');

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('❌ Error updating product:', error);
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
        console.log('🗑️ Deleting product:', req.params.id);

        const product = await Product.findOneAndDelete({ 
            _id: req.params.id, 
            createdBy: req.userId 
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('✅ Product deleted successfully');

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};