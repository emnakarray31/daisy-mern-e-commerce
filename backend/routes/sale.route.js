import express from 'express';
import {
  getAllSales,
  getSaleById,
  getActiveSales,
  createSale,
  updateSale,
  toggleSaleActive,
  deleteSale,
  getProductsOnSale,
} from '../controllers/sale.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/active', getActiveSales);
router.get('/products', getProductsOnSale);

router.get('/', protectRoute, adminRoute, getAllSales);
router.get('/:id', protectRoute, adminRoute, getSaleById);
router.post('/', protectRoute, adminRoute, createSale);
router.put('/:id', protectRoute, adminRoute, updateSale);
router.patch('/:id/toggle', protectRoute, adminRoute, toggleSaleActive);
router.delete('/:id', protectRoute, adminRoute, deleteSale);

export default router;