require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Contact = require('./models/Contact');

const PH = 'https://placehold.co/600x600/e2e8f0/475569?text=';

const PRODUCTS = [
  { title:'Spiral Vase – Parametric Design', shortDescription:'Elegant spiral vase for home décor.', description:'A stunning parametrically designed spiral vase combining mathematical precision with artistic beauty. Premium PLA for smooth finish and vibrant colors.', images:[PH+'Spiral+Vase',PH+'Vase+Side'], material:'PLA', category:'Home Decor', price:499, bulkPricing:[{minQty:5,maxQty:9,pricePerUnit:449},{minQty:10,maxQty:49,pricePerUnit:399},{minQty:50,pricePerUnit:349}], colors:['White','Black','Gold','Silver'], featured:true, inStock:true, rating:{average:4.8,count:124}, tags:['vase','home decor','gift'], customizable:true },
  { title:'Gear Mechanism Display Model', shortDescription:'Fully functional gear mechanism model.', description:'Intricate gear mechanism model with all gears rotating smoothly. Ideal for engineers, educators or as desktop display. Printed in ABS for durability.', images:[PH+'Gear+Mechanism',PH+'Gear+Detail'], material:'ABS', category:'Functional Parts', price:899, bulkPricing:[{minQty:3,maxQty:9,pricePerUnit:799},{minQty:10,pricePerUnit:699}], colors:['Black','Dark Grey'], featured:true, inStock:true, rating:{average:4.9,count:87}, tags:['gear','mechanism','engineering','display'] },
  { title:'Minimalist Phone Stand', shortDescription:'Sleek adjustable phone stand for any desk.', description:'Minimalist functional phone stand for desks and workspaces. Supports phones of all sizes. Anti-slip base. PETG for heat resistance and durability.', images:[PH+'Phone+Stand',PH+'Stand+Side'], material:'PETG', category:'Functional Parts', price:299, bulkPricing:[{minQty:5,maxQty:19,pricePerUnit:249},{minQty:20,pricePerUnit:199}], colors:['White','Black','Grey'], featured:true, inStock:true, rating:{average:4.7,count:203}, tags:['phone stand','desk','functional'], customizable:true },
  { title:'Hexagon Planter – Set of 3', shortDescription:'Geometric hexagon planter set for succulents.', description:'Beautiful geometric hexagon planters perfect for succulents and small plants. Set of 3 different sizes. Drainage hole included. Eco-friendly PLA.', images:[PH+'Planter+Hex',PH+'Planter+Set'], material:'PLA', category:'Home Decor', price:399, bulkPricing:[{minQty:4,maxQty:9,pricePerUnit:349},{minQty:10,pricePerUnit:299}], colors:['White','Terracotta','Sage Green','Black'], featured:false, inStock:true, rating:{average:4.6,count:156}, tags:['planter','geometric','succulent','home'], customizable:true },
  { title:'Articulated Dragon Figurine', shortDescription:'Print-in-place articulated dragon collectible.', description:'Stunning print-in-place articulated dragon with full movement in every joint. No assembly required. A technical marvel and collector item. Available in multiple scales.', images:[PH+'Dragon+Figurine',PH+'Dragon+Detail'], material:'PLA', category:'Toys & Figurines', price:699, bulkPricing:[{minQty:3,maxQty:9,pricePerUnit:599},{minQty:10,pricePerUnit:499}], colors:['Dragon Red','Midnight Black','Ice Blue','Gold'], featured:true, inStock:true, rating:{average:5.0,count:312}, tags:['dragon','articulated','figurine','collectible','gift'] },
  { title:'Gaming Controller Stand', shortDescription:'Universal gaming controller display stand.', description:'Perfectly designed stand for any gaming controller. Compatible with PlayStation, Xbox, Nintendo Switch. Keeps setup clean and organized. Durable ABS.', images:[PH+'Controller+Stand'], material:'ABS', category:'Functional Parts', price:349, bulkPricing:[{minQty:5,maxQty:19,pricePerUnit:299},{minQty:20,pricePerUnit:249}], colors:['Black','White'], featured:false, inStock:true, rating:{average:4.5,count:89}, tags:['gaming','controller','stand','desk'], customizable:true },
  { title:'Cable Organizer – Desk Edition', shortDescription:'Smart cable management solution for desks.', description:'Eliminate desk cable chaos with this sleek cable organizer. Holds up to 6 cables. Adhesive base for secure mounting. Flexible TPU material.', images:[PH+'Cable+Organizer'], material:'TPU', category:'Functional Parts', price:199, bulkPricing:[{minQty:5,maxQty:19,pricePerUnit:169},{minQty:20,pricePerUnit:139}], colors:['Black','White','Grey'], featured:false, inStock:true, rating:{average:4.4,count:201}, tags:['cable','organizer','desk','management'] },
  { title:'Custom Keychain – Personalized', shortDescription:'Fully personalized custom keychain.', description:'Design your perfect keychain. Add names, logos, initials, or any custom text. Perfect for gifts, branding, or personal use. Premium PLA with smooth finish.', images:[PH+'Keychain+Custom',PH+'Keychain+Set'], material:'PLA', category:'Custom Orders', price:149, bulkPricing:[{minQty:10,maxQty:49,pricePerUnit:119},{minQty:50,maxQty:99,pricePerUnit:99},{minQty:100,pricePerUnit:79}], colors:['All colors'], featured:false, inStock:true, rating:{average:4.8,count:445}, tags:['keychain','custom','personalized','gift'], customizable:true },
  { title:'Architectural Scale Model', shortDescription:'High-detail architectural prototype model.', description:'Precision architectural scale models for presentations, approvals, and exhibitions. Custom built from your CAD files. Ultra-high detail resin printing. Used by architects across India.', images:[PH+'Architecture+Model'], material:'Resin (SLA)', category:'Prototypes', price:2999, bulkPricing:[], colors:['White','Beige','Grey'], featured:true, inStock:true, rating:{average:4.9,count:43}, tags:['architecture','scale model','prototype','professional'], customizable:true },
  { title:'Industrial Bracket – Custom', shortDescription:'Heavy-duty industrial mounting bracket.', description:'Custom industrial mounting brackets in Nylon for extreme strength and heat resistance. Used in manufacturing, automation, heavy machinery. ISO tolerances available.', images:[PH+'Industrial+Bracket'], material:'Nylon', category:'Industrial Parts', price:1499, bulkPricing:[{minQty:5,maxQty:24,pricePerUnit:1299},{minQty:25,maxQty:99,pricePerUnit:1099},{minQty:100,pricePerUnit:899}], colors:['Black','Natural White'], featured:false, inStock:true, rating:{average:4.7,count:28}, tags:['industrial','bracket','nylon','custom'], customizable:true },
  { title:'Geometric Wall Art – Honeycomb', shortDescription:'Modular honeycomb wall art panels.', description:'Transform your walls with stunning modular honeycomb wall art. Each panel snaps together. Create any size arrangement. Lightweight yet sturdy PLA.', images:[PH+'Wall+Art'], material:'PLA', category:'Art & Design', price:799, bulkPricing:[{minQty:3,maxQty:9,pricePerUnit:699},{minQty:10,pricePerUnit:599}], colors:['White','Black','Gold','Rose Gold','Copper'], featured:false, inStock:true, rating:{average:4.6,count:67}, tags:['wall art','honeycomb','geometric','decor'], customizable:true },
  { title:'Flexible Phone Case – Custom', shortDescription:'Custom flexible TPU phone case.', description:'Protect your phone in style with a custom designed flexible case. Add your logo, artwork or text. Compatible with iPhone and Android. Premium shock-absorbing TPU.', images:[PH+'Phone+Case'], material:'TPU', category:'Custom Orders', price:249, bulkPricing:[{minQty:10,maxQty:49,pricePerUnit:199},{minQty:50,pricePerUnit:149}], colors:['Clear','Black','All colors'], featured:false, inStock:true, rating:{average:4.5,count:189}, tags:['phone case','custom','flexible'], customizable:true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({}), Contact.deleteMany({})]);
    console.log('🗑️  Cleared collections');

    const admin = await User.create({ name:'Print3D Admin', email: process.env.ADMIN_EMAIL || 'admin@print3d.com', password: process.env.ADMIN_PASSWORD || 'Admin@123456', role:'admin', phone:'+91 98765 43210' });
    console.log(`👑 Admin: ${admin.email}`);

    const users = await User.create([
      { name:'Rohit Sharma', email:'rohit@example.com', password:'User@123456', phone:'+91 98111 22333' },
      { name:'Anjali Verma', email:'anjali@example.com', password:'User@123456', phone:'+91 98444 55666' },
      { name:'Vikram Patel', email:'vikram@example.com', password:'User@123456', phone:'+91 98777 88999' },
    ]);
    console.log(`👥 ${users.length} sample users`);

    const products = await Product.create(PRODUCTS);
    console.log(`📦 ${products.length} products`);

    for (const order of [
      { user:users[0]._id, items:[{product:products[0]._id,title:products[0].title,image:products[0].images[0],material:'PLA',quantity:2,pricePerUnit:499,totalPrice:998}], shippingAddress:{name:'Rohit Sharma',phone:'9811122333',street:'123 MG Road',city:'Bangalore',state:'Karnataka',pincode:'560001'}, pricing:{subtotal:998,shipping:0,tax:180,total:1178}, payment:{status:'paid',razorpayOrderId:'order_seed_001',razorpayPaymentId:'pay_seed_001',paidAt:new Date()}, orderStatus:'delivered', statusHistory:[{status:'pending',note:'Order placed'},{status:'confirmed',note:'Payment received'},{status:'printing',note:'Printing started'},{status:'delivered',note:'Delivered'}] },
      { user:users[1]._id, items:[{product:products[4]._id,title:products[4].title,image:products[4].images[0],material:'PLA',quantity:1,pricePerUnit:699,totalPrice:699}], shippingAddress:{name:'Anjali Verma',phone:'9844455666',street:'45 Nehru Place',city:'New Delhi',state:'Delhi',pincode:'110019'}, pricing:{subtotal:699,shipping:99,tax:126,total:924}, payment:{status:'paid',paidAt:new Date()}, orderStatus:'printing', statusHistory:[{status:'pending',note:'Order placed'},{status:'confirmed',note:'Payment received'},{status:'printing',note:'Currently printing'}] },
      { user:users[2]._id, items:[{product:products[2]._id,title:products[2].title,image:products[2].images[0],material:'PETG',quantity:5,pricePerUnit:249,totalPrice:1245}], shippingAddress:{name:'Vikram Patel',phone:'9877788999',street:'78 SG Highway',city:'Ahmedabad',state:'Gujarat',pincode:'380015'}, pricing:{subtotal:1245,shipping:0,tax:224,total:1469}, payment:{status:'pending'}, orderStatus:'pending', statusHistory:[{status:'pending',note:'Awaiting payment'}] },
    ]) {
      await Order.create(order);
    }
    console.log('🛒 Sample orders');

    await Contact.create([
      {name:'Priya Singh',email:'priya@example.com',phone:'9900001111',subject:'Bulk Order Inquiry',message:'We need 500 custom brackets. Please share bulk pricing.',status:'new'},
      {name:'Arjun Mehta',email:'arjun@example.com',subject:'Material Query',message:'What is the difference between ABS and PETG for outdoor use?',status:'read'},
    ]);
    console.log('📬 Sample contacts');

    console.log('\n🎉 Seeding complete!');
    console.log('─'.repeat(40));
    console.log('Admin  →', admin.email, '/', process.env.ADMIN_PASSWORD || 'Admin@123456');
    console.log('User   →  rohit@example.com / User@123456');
    console.log('─'.repeat(40));
    process.exit(0);
  } catch(err) { console.error('❌ Seed failed:', err); process.exit(1); }
}
seed();
