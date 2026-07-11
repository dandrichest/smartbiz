import Product from "../../models/Product.js";

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

export { deleteProduct };