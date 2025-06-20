import {Cart, CartItem, Product, ProductSize} from '../models/main.js' 

// Fetch current user's cart with items
const getCart = async (req, res) => {
  const Id = req.user.userId;
  try {
    const cart = await Cart.findOne(
      {
        attributes : {
          exclude : ['createdAt', 'updatedAt']
        },
        where : {userId : Id},
        include : [
          {
            model : CartItem,
            as : 'items',
            attributes: { 
            exclude: ['createdAt', 'updatedAt']
          },
            include : [
              {
                model : Product,
                as : 'products',
                attributes: {
                  exclude : ['createdAt', 'updatedAt','description', 'categoryId']
                }
              }
            ]
          }
        ]
      }
    );
    if(cart.length === 0){
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  const id = req.user.userId;
  const { productId, quantity ,size} = req.body;
  try {
    const [cart,created] = await Cart.findOrCreate({
      attributes : ['cartId'],
      where : { userId : id},
      defaults: {
        userId: id
      }
    });

    const existingItem = await CartItem.findOne({
      where : {
        cartId: cart.cartId,
        productId: productId
      }
    });
    if(existingItem){
      existingItem.quantity += quantity;
      await existingItem.save();
    }else{
      await CartItem.create({
        cartId : cart.cartId,
        productId : productId,
        quantity: quantity,
        size : size
      })
    }
    res.json({ message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const id = req.user.userId;
  const { itemId } = req.params;
  try {
    const cart = await Cart.findOne({
      attributes : ['cartId'],
      where : {userId : id}
    })
    await CartItem.destroy({
      where : {
        cartId : cart.cartId,
        cartItemId : itemId
      }
    })
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  const id = req.user.userId;
  const { itemId } = req.params;
  const { size,quantity } = req.body;
  try {
    const cart = await Cart.findOne({
      attributes : ['cartId'],
      where : {
        userId : id
      },
      include : {
        model : CartItem,
        as : 'items',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {
          cartItemId: itemId
        }
      }
    })
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    const cartItem = cart.items[0];

    if (size) cartItem.size = size;
    if (quantity) cartItem.quantity = quantity;

    await cartItem.save();
    res.json({ message: 'Cart item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  const id = req.user.userId;
  try {
    const cart = await Cart.findOne({
      attributes : ['cartId'],
      where : { userId : id}
    })
    if(!cart){
      return res.status(404).json({ message: 'Cart not found' });
    }else{
      await CartItem.destroy({
        where : {
          cartId : cart.cartId
        }
      })
    }
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

export  {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
};
