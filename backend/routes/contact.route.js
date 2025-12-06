import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} from '../controllers/contact.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', createContact);


router.get('/', protectRoute, adminRoute, getAllContacts);
router.get('/:id', protectRoute, adminRoute, getContactById);
router.put('/:id', protectRoute, adminRoute, updateContactStatus);
router.delete('/:id', protectRoute, adminRoute, deleteContact);

export default router;