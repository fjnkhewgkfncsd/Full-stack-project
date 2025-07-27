export const cacheFav = (cacheKey,id) => {
    let array = [];
    const cached = localStorage.getItem(cacheKey);
    if(cached){
        array = JSON.parse(cached);
    }
    array.push(id);
    localStorage.setItem(cacheKey,JSON.stringify(array))
}

export const removeFav = (cacheKey,id) => {
    let array = [];
    const cached = localStorage.getItem(cacheKey);
    if(cached){
        array = JSON.parse(cached);
    }
    array = array.filter(item => item !== id);
    localStorage.setItem(cacheKey,JSON.stringify(array));
}