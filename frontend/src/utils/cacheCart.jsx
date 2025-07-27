const addCartToCache = (order) => {
    const cacheKey= `cartItems`;
    const cached = localStorage.getItem(cacheKey);
    let cartArray = [];
    if(cached){
        cartArray = JSON.parse(cached);
    }
    cartArray.push(order);
    localStorage.setItem(cacheKey,JSON.stringify(cartArray))
    console.log("cart cached successfully", order)
}

const checkIfCartExisting = (orderID,size) => {
    const cacheKey = `cartItems`;
    const cached = localStorage.getItem(cacheKey)
    if(!cached){
        console.log('no cart items found');
        return -1;
    }
    const arrayCartItems = JSON.parse(cached);
    
    const existingIndex = arrayCartItems.findIndex(
        item => item.product_id === orderID && size === item.size
    )
    console.log('passed findindex')
    return existingIndex;
}
const removeCartFromCache = (orderID) => {
    const cacheKey = `cart_${orderID}`
    localStorage.removeItem(cacheKey)
    console.log("cart removed from cache", orderID)
}

const updateCartInCache = (order,cartIndex) => {
    const cacheKey = `cartItems`;
    const cached = localStorage.getItem(cacheKey);
    let arrayCartItems = [];
    if(cached){
        arrayCartItems = JSON.parse(cached);
    }
    arrayCartItems[cartIndex].quantity += order.quantity;
    localStorage.setItem(cacheKey,JSON.stringify(arrayCartItems));
}

export {addCartToCache, checkIfCartExisting, removeCartFromCache, updateCartInCache};