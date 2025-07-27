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
                as : 'product',
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
      return res.status(404).json({
        message: 'Cart not found',
        success: false,
        data : []
      });
    }
    res.json({ 
      data: cart.items,
      message: 'Cart fetched successfully',
      success: true
     });
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
        productId: productId,
        size : size
      }
    });
    if(existingItem){
      console.log('Updating existing cart item');
      existingItem.quantity += quantity;
      await existingItem.save();
    }else{
      console.log('Creating new cart item');
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

const insertFromLocalStorageToDb = async (req, res) => {
  const {items} = req.body;
  const id = req.user.userId;
  try{
    const [cart, created] = await Cart.findOrCreate({
      attributes : ['cartId'],
      where : { userId : id},
      defaults: {
        userId: id
      }
    });
    for(const item of items){
      const existingItem = await CartItem.findOne({
        where : {
          cartId: cart.cartId,
          productId: item.product_id,
          size: item.size
        }
      });
      if(existingItem){
        existingItem.quantity += item.quantity;
        await existingItem.save();
      }else{
        await CartItem.create({
          cartId : cart.cartId,
          productId : item.product_id,
          quantity: item.quantity,
          size : item.size
        })
      }
    }
    console.log('Items added to cart from local storage');
    res.json({ message: 'Items added to cart from local storage' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error adding items to cart from local storage' });
  }
}
// Remove item from cart
const removeFromCart = async (req, res) => {
  const id = req.user.userId;
  const { itemId } = req.params;
  const { size, quantity } = req.body;
  console.log('id:', id ," itemId:",itemId, " size:",size, " quantity:", quantity);
  try {
    const cart = await Cart.findOne({
      attributes : ['cartId'],
      where : {userId : Number(id)}
    })
    console.log('Cart found:', cart);
    await CartItem.destroy({
      where : {
        cartId : cart.cartId,
        productId : itemId,
        size : size,
        quantity : quantity
      }
    })
    res.json({
      message: 'Item removed from cart',
      success: true
     });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing from cart',
    success: false
     });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  const id = req.user.userId;
  const { itemID } = req.params;
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
          productId: itemID,
          size:size
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

const updateCartItemSize = async (req, res) => {
  const id = req.user.userId;
  const { itemID } = req.params;
  const { size,oldSize } = req.body;
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
          productId: itemID,
          size:oldSize
        }
      }
    })
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    const cartItem = cart.items[0];

    if (size) cartItem.size = size;
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
  insertFromLocalStorageToDb,
  updateCartItemSize
};
