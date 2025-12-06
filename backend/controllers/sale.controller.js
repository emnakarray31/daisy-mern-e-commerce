import Sale from '../models/sale.model.js';
import Product from '../models/product.model.js';
 
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('products', 'name price image')
      .sort({ createdAt: -1 });
    
    res.json(sales);
  } catch (error) {
    console.error('Error in getAllSales:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('products', 'name price image category');
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.json(sale);
  } catch (error) {
    console.error('Error in getSaleById:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getActiveSales = async (req, res) => {
  try {
    const now = new Date();
    const sales = await Sale.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate('products', 'name price image');
    
    res.json(sales);
  } catch (error) {
    console.error('Error in getActiveSales:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const createSale = async (req, res) => {
  try {
    const { name, description, discountType, discountValue, startDate, endDate, isActive, products } = req.body;

    if (!name || !discountValue || !startDate || !endDate || !products || products.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingProducts = await Product.find({ _id: { $in: products } });
    if (existingProducts.length !== products.length) {
      return res.status(400).json({ message: 'Some products do not exist' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const sale = new Sale({
      name,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      products,
    });

    await sale.save();
    await sale.populate('products', 'name price image');

    res.status(201).json(sale);
  } catch (error) {
    console.error('Error in createSale:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSale = async (req, res) => {
  try {
    const { name, description, discountType, discountValue, startDate, endDate, isActive, products } = req.body;

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (products && products.length > 0) {
      const existingProducts = await Product.find({ _id: { $in: products } });
      if (existingProducts.length !== products.length) {
        return res.status(400).json({ message: 'Some products do not exist' });
      }
    }

    const newStartDate = startDate ? new Date(startDate) : sale.startDate;
    const newEndDate = endDate ? new Date(endDate) : sale.endDate;
    if (newStartDate >= newEndDate) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    if (name !== undefined) sale.name = name;
    if (description !== undefined) sale.description = description;
    if (discountType !== undefined) sale.discountType = discountType;
    if (discountValue !== undefined) sale.discountValue = discountValue;
    if (startDate !== undefined) sale.startDate = startDate;
    if (endDate !== undefined) sale.endDate = endDate;
    if (isActive !== undefined) sale.isActive = isActive;
    if (products !== undefined) sale.products = products;

    await sale.save();
    await sale.populate('products', 'name price image');

    res.json(sale);
  } catch (error) {
    console.error('Error in updateSale:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleSaleActive = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    sale.isActive = req.body.isActive !== undefined ? req.body.isActive : !sale.isActive;
    await sale.save();

    res.json(sale);
  } catch (error) {
    console.error('Error in toggleSaleActive:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    await sale.deleteOne();
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error in deleteSale:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProductsOnSale = async (req, res) => {
  try {
    const now = new Date();
    const activeSales = await Sale.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).select('products discountType discountValue');

    const productIds = new Set();
    activeSales.forEach(sale => {
      sale.products.forEach(productId => {
        productIds.add(productId.toString());
      });
    });

    const products = await Product.find({ _id: { $in: Array.from(productIds) } });

    const productsWithSales = products.map(product => {
      const productSales = activeSales.filter(sale => 
        sale.products.some(p => p.toString() === product._id.toString())
      );

      let bestDiscount = 0;
      let bestSale = null;

      productSales.forEach(sale => {
        let discount = 0;
        if (sale.discountType === 'percentage') {
          discount = product.price * (sale.discountValue / 100);
        } else {
          discount = sale.discountValue;
        }

        if (discount > bestDiscount) {
          bestDiscount = discount;
          bestSale = sale;
        }
      });

      const discountedPrice = product.price - bestDiscount;

      return {
        ...product.toObject(),
        onSale: true,
        originalPrice: product.price,
        salePrice: discountedPrice,
        discount: bestSale ? {
          type: bestSale.discountType,
          value: bestSale.discountValue,
        } : null,
      };
    });

    res.json(productsWithSales);
  } catch (error) {
    console.error('Error in getProductsOnSale:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};