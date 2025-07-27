import User from './User.js';
import Category from './categories.js';
import Product from './products.js';
import ProductSize from './product_sizes.js';
import Cart from './cart.js';
import CartItem from './CartItem.js';
import Favorite from './favorite.js';
import Order from './orders.js';
import OrderItem from './orderItems.js';
import Payment from './payments.js';
import Shipment from './shipments.js';
import Notification from './notifications.js';
import Banner from './Banner.js';

// ✅ CATEGORY - PRODUCT (One-to-Many)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// ✅ PRODUCT - PRODUCT_SIZE (One-to-Many)
Product.hasMany(ProductSize, { foreignKey: 'product_id', as: 'sizes' });
ProductSize.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ✅ USER - CART (One-to-One)
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ✅ CART - CART_ITEM (One-to-Many)
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

// ✅ PRODUCT - CART_ITEM (One-to-Many)
Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ✅ USER - FAVORITE (One-to-Many)
User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ✅ PRODUCT - FAVORITE (One-to-Many)
Product.hasMany(Favorite, { foreignKey: 'product_id', as: 'favoritedBy' });
Favorite.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ✅ USER - ORDER (One-to-Many)
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ✅ ORDER - ORDER_ITEM (One-to-Many)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// ✅ PRODUCT - ORDER_ITEM (One-to-Many)
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ✅ ORDER - PAYMENT (One-to-Many)
Order.hasMany(Payment, { foreignKey: 'order_id', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// ✅ ORDER - SHIPMENT (One-to-Many)
Order.hasMany(Shipment, { foreignKey: 'order_id', as: 'shipments' });
Shipment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Export all models
export {
  User,
  Category,
  Product,
  ProductSize,
  Cart,
  CartItem,
  Favorite,
  Order,
  OrderItem,
  Payment,
  Shipment,
  Notification,
  Banner
};
