import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
console.log('🔑 Loading Stripe with key:', process.env.STRIPE_SECRET_KEY ? 'Key found ✅' : 'Key missing ❌');

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
