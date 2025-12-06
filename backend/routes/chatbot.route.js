import express from 'express';
import { chatbotMessage, getSuggestedQuestions } from '../controllers/chatbot.controller.js';

const router = express.Router();
 
router.post('/', chatbotMessage);
 
router.get('/suggestions', getSuggestedQuestions);

export default router;