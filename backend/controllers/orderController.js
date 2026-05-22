import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Simulated email notification function (can be replaced with nodemailer/sendgrid)
const sendOrderNotification = async (admin, order, customerName) => {
  console.log(`
╔════════════════════════════════════════╗
║      📧 NEW ORDER NOTIFICATION         ║
╚════════════════════════════════════════╝
┌─ ORDER DETAILS ─────────────────────────┐
│ Admin: ${admin.email}
│ Customer: ${customerName}
│ Order ID: ${order._id}
│ Total Price: $${order.totalPrice}
│ Status: ${order.status}
│ Created: ${new Date(order.createdAt).toLocaleString()}
│ Products: ${order.products.length} item(s)
└─────────────────────────────────────────┘
  `);
  
  // TODO: Integrate with email service (nodemailer/sendgrid)
  // await emailService.send({
  //   to: admin.email,
  //   subject: `New Order #${order._id}`,
  //   template: 'newOrder',
  //   data: { order, customerName }
  // })
};

// @desc    Create order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id }).populate('productId');

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderProducts = [];
    let totalPrice = 0;

    for (const item of cartItems) {
      const product = item.productId;
      if (!product) continue;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}`,
        });
      }

      orderProducts.push({
        product: product._id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });

      totalPrice += product.price * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user._id,
      products: orderProducts,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || 'card',
      totalPrice,
      status: 'pending',
    });

    await Cart.deleteMany({ userId: req.user._id });

    // Send notification to all admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await sendOrderNotification(admin, order, req.user.name);
    }

    console.log(`
╔════════════════════════════════════════╗
║        ✅ ORDER CREATED SUCCESSFULLY    ║
╚════════════════════════════════════════╝
Order ID: ${order._id}
Customer: ${req.user.name}
Total: $${totalPrice}
    `);

    res.status(201).json(order);
  } catch (error) {
    console.error(`
╔════════════════════════════════════════╗
║       ❌ ORDER CREATION FAILED         ║
╚════════════════════════════════════════╝
Error: ${error.message}
    `);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('products.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.status;
    order.status = req.body.status || order.status;
    await order.save();

    // Log status change notification
    console.log(`
╔════════════════════════════════════════╗
║   📦 ORDER STATUS UPDATED              ║
╚════════════════════════════════════════╝
┌─ STATUS CHANGE ─────────────────────────┐
│ Order ID: ${order._id}
│ Customer: ${order.userId.name}
│ Email: ${order.userId.email}
│ Old Status: ${oldStatus}
│ New Status: ${order.status}
│ Updated At: ${new Date().toLocaleString()}
└─────────────────────────────────────────┘
    `);

    res.json(order);
  } catch (error) {
    console.error(`
╔════════════════════════════════════════╗
║   ❌ STATUS UPDATE FAILED              ║
╚════════════════════════════════════════╝
Error: ${error.message}
    `);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order analytics (admin)
// @route   GET /api/orders/analytics
export const getOrderAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      statusCounts,
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
