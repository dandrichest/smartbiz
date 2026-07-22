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

//Delete product functionality
const deleteProduct = async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json({message: 'Product deleted successfully', product});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export { deleteProduct, addProduct, editProduct};