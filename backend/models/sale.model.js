import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sale name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value must be positive'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
  },
  {
    timestamps: true,
  }
);

saleSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
};

saleSchema.methods.calculateDiscountedPrice = function(originalPrice) {
  if (!this.isCurrentlyActive()) {
    return originalPrice;
  }

  if (this.discountType === 'percentage') {
    return originalPrice * (1 - this.discountValue / 100);
  } else {
    return Math.max(0, originalPrice - this.discountValue);
  }
};

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;