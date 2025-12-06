import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/order.model.js';
import User from './models/user.model.js';

dotenv.config();

console.log('🔄 Starting migration...\n');
await mongoose.connect(process.env.MONGO_URI);
console.log('✅ Database connected\n');
const orders = await Order.find();
console.log(`📦 Found ${orders.length} orders in database\n`);

if (orders.length === 0) {
  console.log('⚠️  No orders found. Create a test order first!');
  mongoose.disconnect();
  process.exit(0);
}

let updated = 0;
let failed = 0;

for (const order of orders) {
  try {
    if (!order.user) {
      console.log(`⚠️  Order ${order._id} has no user field`);
      failed++;
      continue;
    }

    const result = await User.findByIdAndUpdate(
      order.user,
      { $addToSet: { orders: order._id } },  
      { new: true }
    );

    if (result) {
      console.log(`✅ Added order ${order._id.toString().slice(-6)} to user ${result.name}`);
      updated++;
    } else {
      console.log(`❌ User ${order.user} not found for order ${order._id}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ Error with order ${order._id}:`, error.message);
    failed++;
  }
}

console.log('\n📊 Migration Summary:');
console.log('===================');
console.log(`✅ Successfully updated: ${updated}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📦 Total orders: ${orders.length}`);

console.log('\n🔍 Verification:');
console.log('===============');

const users = await User.find().select('name email orders');
for (const user of users) {
  if (user.orders && user.orders.length > 0) {
    console.log(`👤 ${user.name}: ${user.orders.length} orders`);
  }
}

mongoose.disconnect();
console.log('\n✅ Migration complete!');