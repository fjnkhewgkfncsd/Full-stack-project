export const cacheFav = (cacheKey,id) => {
    console.log('Caching favorite with key:', cacheKey, 'and id:', id);
    localStorage.setItem(cacheKey,JSON.stringify(id))
}

export const getFav = (cacheKey) => {
    const cached = localStorage.getItem(cacheKey);
    if(cached){
        console.log('Cache hit for key:', cacheKey);
        return JSON.parse(cached)
    }
    return null;
}

export const removeFav = (cacheKey) => {
    console.log('Removing favorite with key:', cacheKey);
    localStorage.removeItem(cacheKey);
}