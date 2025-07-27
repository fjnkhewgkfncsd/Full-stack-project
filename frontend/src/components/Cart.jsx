"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { X, ShoppingBag } from "lucide-react"
import { Trash2 } from 'lucide-react';


const Cart = ({ isOpen, onClose }) => {
  const [cartItem, setCartItem] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isCartEmpty, setIsCartEmpty] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
  if (isOpen) {
    (async () => {
      await checkIsLoggedIn();
    })();
  }
}, [isOpen]);

useEffect(() => {
  if(cartItem.length > 0){
    const total = calculateTotalPrice(cartItem);
    setTotalPrice(total);
  }
}, [cartItem]);

useEffect(() => {
  if (isOpen) {
    if (isLoggedIn) {
      (async () => await insertFromLocalStorageToDb())();
      fetchCartItems();
    } else {
      fetchcartItemFromLocalStorage();
    }
  }
}, [isOpen, isLoggedIn]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart/", { withCredentials: true })
      if (response.data.success) {
        const items = response.data.data || [];
        const cartItems = items.map(item => ({
          cartItemId: item.cartItemId,
          product_id: item.productId, // use productId from cart item
          size: item.size,
          quantity: item.quantity,
          image_url: item.product?.image_url,
          name: item.product?.product_name, // use product_name
          price: item.product?.price,
        }));
        setCartItem(cartItems);
        setIsCartEmpty(items.length === 0)
      }else{
        setIsCartEmpty(true)
        setCartItem([]);
      }

    } catch (error) {
      console.error("Error fetching cart items:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const insertFromLocalStorageToDb = async () => {
    const cacheKey = 'cartItems';
    const cachedItems = localStorage.getItem(cacheKey);
    let items = [];
    if(cachedItems){
      items = JSON.parse(cachedItems);
      try {
        const res = await axios.post('http://localhost:5000/api/cart/insert',{
          items:items
        },
        {
          withCredentials: true,
        })
        if(res.status === 200){
          localStorage.removeItem(cacheKey);
        }
      } catch (error) {
        console.error("Error inserting cart items to DB:", error)
      }
    }
  }
  const fetchcartItemFromLocalStorage = () => {
    try {
      const cachedKey = 'cartItems';
      const cachedItems = localStorage.getItem(cachedKey);
      if (cachedItems) {
        setCartItem(Array.isArray(JSON.parse(cachedItems)) ? JSON.parse(cachedItems) : []);
        setIsCartEmpty(false);
        const total = calculateTotalPrice(JSON.parse(cachedItems));
        setTotalPrice(total);
        console.log('Cart items fetched from local storage:', JSON.parse(cachedItems));
      }else{
        setIsCartEmpty(true);
        setCartItem([]);
        console.log('No cart items found in local storage');
      }
    } catch (error) {
      console.error("Error fetching cart items from local storage:", error)
    }
  }
  const checkIsLoggedIn = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile", { withCredentials: true })
      if(!response.data.isLogged){
        setIsLoggedIn(false)
      }else{
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error("Error checking login status:", error)
    }
  }

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      return total + Number(item.price) * item.quantity
    }, 0)
  }

  const updateCartItemQuantity = async (itemID, quantity,oldQuantity,size) => {
    if(isLoggedIn && quantity === oldQuantity) return; // No need to update if quantity is the same
    if(isLoggedIn){
      try {
        const response = await axios.put(
          `http://localhost:5000/api/cart/update/${itemID}`,
          {
            quantity,
            size
          },
          {
            withCredentials: true,
          },
        )
        if (response.status === 200) {
            await fetchCartItems(); // Fetch updated cart items
        }
      } catch (error) {
        console.error("Error updating cart item:", error)
      }
    }else{
      const cacheKey = 'cartItems';
      const cached = localStorage.getItem(cacheKey);
      if(cached){
        const cartArray = JSON.parse(cached);
        const existingIndex = cartArray.findIndex(item => item.product_id === itemID && item.size === size && item.quantity === oldQuantity);
        if(existingIndex !== -1){
          cartArray[existingIndex].quantity = quantity;
          localStorage.setItem(cacheKey, JSON.stringify(cartArray));
          setCartItem(cartArray);
        }
      }
    }
  }

  const updateCartItemSize = async (itemID, size,oldSize) => {
    if(size === oldSize) return; // No need to update if size is the same
    if(isLoggedIn){
      try {
        const response = await axios.put(
          `http://localhost:5000/api/cart/update/size/${itemID}`,
          { size,
            oldSize
          },
          {
            withCredentials: true,
          },
        )
        if (response.status === 200) {
          await fetchCartItems(); 
        }
      } catch (error) {
        console.error("Error updating cart item size:", error)
      }
    }else{
      const cacheKey = 'cartItems';
      const cached = localStorage.getItem(cacheKey);
      let cartArray = [];
      if(cached){
        cartArray = JSON.parse(cached);
      }
      const exitingExistingIndex = cartArray.findIndex(
        item => item.product_id === itemID && item.size === oldSize
      )
      console.log('exitingExistingIndex', exitingExistingIndex)
      if(exitingExistingIndex !== -1){
        console.log('Updating size in existing cart item');
        cartArray[exitingExistingIndex].size = size;
        localStorage.setItem(cacheKey, JSON.stringify(cartArray));
        setCartItem(cartArray);
      }
    }
  }

  const removeCartItem = async (itemId,size,quantity) => {
    
    if(isLoggedIn){
      try {
        const res = await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
            data: { size, quantity },
            withCredentials: true
          });
        console.log('hello');
        if (res.data.success) {
          console.log("Cart item removed successfully");
          await fetchCartItems(); // Fetch updated cart items
        }
      } catch (error) {
        console.error("Error removing cart item:", error)
      }
    }else{
      const cacheKey = 'cartItems';
      const cached = localStorage.getItem(cacheKey);
      if(cached){
        let cartArray = [];
        cartArray = JSON.parse(cached);
        const existingIndex = cartArray.findIndex(
          item => item.product_id === itemId && item.size === size && item.quantity === quantity
        )
        if(existingIndex !== -1){
          cartArray.splice(existingIndex, 1);
          localStorage.setItem(cacheKey, JSON.stringify(cartArray));
          setCartItem(cartArray);
          if(cartArray.length === 0){
            setIsCartEmpty(true);
          }
        }
      }
    }
  }
  const clearCart = async () => {
    if(isLoggedIn){
      try {
        const response = await axios.delete("http://localhost:5000/api/cart/clear", { withCredentials: true })
        if (response.status === 200) {
          setCartItem([])
          setTotalPrice(0)
          setIsCartEmpty(true)
        }
      } catch (error) {
        console.error("Error clearing cart:", error)
      }
    }else{
      localStorage.removeItem('cartItems');
      setCartItem([]);
      setTotalPrice(0);
      setIsCartEmpty(true);
    }
  }

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay - takes up 66.67% of the screen with semi-transparent background */}
      <div className="w-2/3 h-full bg-black/30 transition-opacity duration-300" onClick={onClose}></div>

      {/* Cart panel - takes up 33.33% of the screen */}
      <div className="w-1/3 h-full bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Cart header */}
          <div className="flex items-center justify-between p-4 border-b
          mt-[9px]">
            <div className="flex items-center">
              <ShoppingBag className="mr-2" />
              <h2 className="text-lg font-semibold">Your bag</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Cart content */}
          <div className="flex-grow overflow-auto p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : isCartEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
                <p className="text-gray-600 mb-8">Check out our latest arrivals stay up-to-date with latest styles</p>
                <h3 className="text-xl font-semibold mb-4">Start shopping</h3>
                <div className="space-y-3 w-full">
                  <button className="w-full py-3 bg-black text-white font-medium">Shop women</button>
                  <button className="w-full py-3 bg-black text-white font-medium">Shop men</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItem.map((item) => (
                  <div key={item.cartItemId||`${item.product_id}-${item.size}`} className="flex pb-4 ">
                    <div className="w-28 h-36 bg-gray-100 mr-3 flex-shrink-0">
                      {item.image_url && (
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-grow space-y-2">
                      <h3 className="font-medium">{(item.name || "Product").toUpperCase()}</h3>
                      <p className="text-sm text-gray-500">${Number(item.price).toFixed(2)}</p>
                      <div className='flex space-x-4'>
                        {item.size && (
                        <div className="mt-1 flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Size:</span>
                          <select
                            value={item.size}
                            onChange={(e) => updateCartItemSize(item.product_id, e.target.value,item.size,item.quantity)}
                            className="text-sm border rounded p-1"
                          >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                          </select>
                        </div>
                      )}

                      {/* Quantity selector */}
                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Qty:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateCartItemQuantity(item.product_id, Number(e.target.value),item.quantity,item.size)}
                          className="text-sm border rounded p-1"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Size selector if applicable */}
                      

                        <button
                          onClick={() => removeCartItem(item.product_id,item.size,item.quantity)}
                          className="ml-auto text-gray-500 hover:text-black text-sm underline"
                        >
                          <Trash2/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart footer - only show if cart has items */}
          {!isCartEmpty && (
            <div className="border-t p-4">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <button className="w-full py-3 bg-black text-white font-medium">Checkout</button>
                <button onClick={clearCart} className="w-full py-2 text-sm text-center underline hover:no-underline">
                  Clear bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart
