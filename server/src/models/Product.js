import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        index: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    costPrice: {
        type: Number,
        required: [true, 'Cost price is required'],
        min: 0,
        default: 0
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: 0,
        default: 0
    },
    category: {
        type: String,
        trim: true,
        default: 'Uncategorized',
        index: true
    },
    sku: {
        type: String,
        trim: true,
        default: '',
        unique: false
    },
    image: {
        type: String,
        default: ''
    },
    minStock: {
        type: Number,
        default: 10,
        min: 0,
        description: 'Minimum stock level before triggering low stock alert'
    },
    lowStockAlertSent: {
        type: Boolean,
        default: false,
        description: 'Flag to track if low stock alert has been sent'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
productSchema.index({ createdBy: 1, category: 1 });
productSchema.index({ createdBy: 1, stockQuantity: 1 });
productSchema.index({ createdBy: 1, minStock: 1 });

// Virtual field for profit margin
productSchema.virtual('profitMargin').get(function() {
    if (this.price > 0 && this.costPrice > 0) {
        return ((this.price - this.costPrice) / this.price * 100).toFixed(2);
    }
    return 0;
});

// Virtual field for stock status
productSchema.virtual('stockStatus').get(function() {
    if (this.stockQuantity === 0) return 'out-of-stock';
    if (this.stockQuantity <= this.minStock) return 'low-stock';
    return 'in-stock';
});

// Virtual field for total value
productSchema.virtual('totalValue').get(function() {
    return this.stockQuantity * this.price;
});

// Method to check if product needs restocking
productSchema.methods.needsRestock = function() {
    return this.stockQuantity <= this.minStock;
};

// ✅ NEW: Method to handle low stock alert flag
productSchema.methods.handleLowStockAlert = function() {
    if (this.stockQuantity > this.minStock) {
        this.lowStockAlertSent = false;
    }
    return this;
};

// ✅ FIXED: Pre-save middleware using async/await (NO next parameter)
productSchema.pre('save', async function() {
    console.log('🔄 Pre-save hook triggered for product:', this.name);
    
    // Reset low stock alert flag if stock is above minimum
    if (this.stockQuantity > this.minStock) {
        this.lowStockAlertSent = false;
        console.log('✅ Low stock alert flag reset');
    }
    
    // Auto-generate SKU if missing
    if (!this.sku && this.name) {
        const prefix = this.category?.substring(0, 3).toUpperCase() || 'PRD';
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.sku = `${prefix}-${random}`;
        console.log('✅ Auto-generated SKU:', this.sku);
    }
    
    console.log('✅ Pre-save hook completed successfully');
});

// Static method to get low stock products for a user
productSchema.statics.getLowStockProducts = async function(userId, threshold = 10) {
    return this.find({
        createdBy: userId,
        stockQuantity: { $lte: threshold }
    }).sort({ stockQuantity: 1 });
};

// Static method to get out of stock products for a user
productSchema.statics.getOutOfStockProducts = async function(userId) {
    return this.find({
        createdBy: userId,
        stockQuantity: { $eq: 0 }
    }).sort({ name: 1 });
};

// Static method to get stock summary for a user
productSchema.statics.getStockSummary = async function(userId) {
    const summary = await this.aggregate([
        { $match: { createdBy: userId } },
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalStock: { $sum: '$stockQuantity' },
                totalValue: { $sum: { $multiply: ['$stockQuantity', '$price'] } },
                lowStockCount: {
                    $sum: {
                        $cond: [
                            { $lte: ['$stockQuantity', '$minStock'] },
                            1,
                            0
                        ]
                    }
                },
                outOfStockCount: {
                    $sum: {
                        $cond: [
                            { $eq: ['$stockQuantity', 0] },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);

    return summary[0] || {
        totalProducts: 0,
        totalStock: 0,
        totalValue: 0,
        lowStockCount: 0,
        outOfStockCount: 0
    };
};

// ToJSON transformation to include virtuals
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// ✅ Safely create the model (prevents overwrite errors in development)
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;