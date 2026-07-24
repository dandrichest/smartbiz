import Product from "../models/Product.js";

//Add product functionality
const addProduct = async(req, res) => {
    const {name, category, price, costPrice, quantity, minStock, image} = req.body;
    try {
        if(!name || !price || !costPrice){
            return res.status(400).json({message: 'Name, price, and costPrice are required'})
        }
        const product = new Product ({
            name,
            category,
            price,
            costPrice,
            quantity,
            minStock,
            image,
        });
        const createdProcuct = await product.save();
        res.status(201).json({message: 'Product created sucessfully', product:createdProcuct});
    }catch(error) {
        res.status(500).json({message: error.message});
    }
}

//Edit product functionality

const editProduct = async(req, res) => {
    const { id } = req.params;
    const { name, category, price, costPrice, quantity, minStock, image } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(
            id,
            { name, category, price, costPrice, quantity, minStock, image },
            {new: true, runValidators: true}
        );
        if(!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json({message: 'Product updated successfully', product});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
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
        const product = await Product.findById(req.params.id);
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



// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
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

export { deleteProduct, addProduct, editProduct};
