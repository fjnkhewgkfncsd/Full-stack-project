"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { X, ShoppingBag } from "lucide-react"

const Cart = ({ isOpen, onClose }) => {
  const [cartItem, setCartItem] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isCartEmpty, setIsCartEmpty] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchCartItems()
    }
  }, [isOpen])

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart", { withCredentials: true })
      if (response.status === 200) {
        const items = response.data.cart?.items || response.data.items || []
        setCartItem(items)
        const total = calculateTotalPrice(items)
        setTotalPrice(total)
        setIsCartEmpty(items.length === 0)
      }
    } catch (error) {
      console.error("Error fetching cart items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  const updateCartItemQuantity = async (itemID, quantity) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/cart/update/${itemID}`,
        {
          quantity,
        },
        {
          withCredentials: true,
        },
      )
      if (response.status === 200) {
        const updatedItems = cartItem.map((item) => {
          if (item.cartItemId === itemID) {
            return {
              ...item,
              quantity: quantity,
            }
          }
          return item
        })
        setCartItem(updatedItems)
        setTotalPrice(calculateTotalPrice(updatedItems))
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
    }
  }

  const updateCartItemSize = async (itemId, size) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/cart/update/${itemId}`,
        { size },
        {
          withCredentials: true,
        },
      )
      if (response.status === 200) {
        setCartItem((prevItems) =>
          prevItems.map((item) => {
            if (item.cartItemId === itemId) {
              return {
                ...item,
                size: size,
              }
            }
            return item
          }),
        )
      }
    } catch (error) {
      console.error("Error updating cart item size:", error)
    }
  }

  const removeCartItem = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, { withCredentials: true })
      if (response.status === 200) {
        const updatedItems = cartItem.filter((item) => item.cartItemId !== itemId)
        setCartItem(updatedItems)
        setTotalPrice(calculateTotalPrice(updatedItems))
        if (updatedItems.length === 0) {
          setIsCartEmpty(true)
        }
      }
    } catch (error) {
      console.error("Error removing cart item:", error)
    }
  }

  const clearCart = async () => {
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
  }

  if (!isOpen) return null

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
                  <div key={item.cartItemId} className="flex border-b pb-4">
                    <div className="w-20 h-20 bg-gray-100 mr-3 flex-shrink-0">
                      {item.product.image && (
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">${item.product.price.toFixed(2)}</p>

                      {/* Size selector if applicable */}
                      {item.size && (
                        <div className="mt-1 flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Size:</span>
                          <select
                            value={item.size}
                            onChange={(e) => updateCartItemSize(item.cartItemId, e.target.value)}
                            className="text-sm border rounded p-1"
                          >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                          </select>
                        </div>
                      )}

                      {/* Quantity selector */}
                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Qty:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateCartItemQuantity(item.cartItemId, Number(e.target.value))}
                          className="text-sm border rounded p-1"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => removeCartItem(item.cartItemId)}
                          className="ml-auto text-gray-500 hover:text-black text-sm underline"
                        >
                          Remove
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
