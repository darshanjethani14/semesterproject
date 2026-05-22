import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Add to cart
// @route   POST /api/cart/add
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cartItem = await Cart.findOne({
      userId: req.user._id,
      productId,
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      if (cartItem.quantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId: req.user._id,
        productId,
        quantity,
      });
    }

    const populated = await Cart.findById(cartItem._id).populate('productId');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user cart
// @route   GET /api/cart
export const getCart = async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user._id }).populate('productId');
    const cart = items.map((item) => ({
      _id: item._id,
      product: item.productId,
      quantity: item.quantity,
      subtotal: item.productId ? item.productId.price * item.quantity : 0,
    }));

    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items: cart, total, count: cart.reduce((s, i) => s + i.quantity, 0) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('productId');

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (quantity < 1) {
      await cartItem.deleteOne();
      return res.json({ message: 'Item removed' });
    }

    if (cartItem.productId.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove from cart
// @route   DELETE /api/cart/:id
export const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.deleteOne();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
