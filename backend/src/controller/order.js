import { Cart, CartItem, Product, Order, OrderItem } from '../models/main.js';

const checkout = async (req, res) => {
  const userId = req.user.userId;
  try {
    // 1. Get user's cart
    const cart = await Cart.findOne({
      attributes : {
        exclude : ['createdAt', 'updatedAt']
      },
      where: { userId },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'products'
        }]
      }]
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Calculate total
    let total = 0;
    cart.items.forEach(item => {
      total += item.quantity * parseFloat(item.products.price);
    });

    // 3. Create order
    const order = await Order.create({
      userId,
      totalAmount: total,
      status: 'pending'
    });

    // 4. Create order items
    const orderItems = cart.items.map(item => ({
      orderId: order.orderId,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.products.price
    }));
    await OrderItem.bulkCreate(orderItems);

    // 5. Clear cart
    await CartItem.destroy({ where: { cartId: cart.cartId } });

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order.orderId,
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing checkout' });
  }
};

export default {
  checkout
};
