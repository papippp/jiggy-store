export function parseStock(rawStock) {
    if (!rawStock) return null
    try {
        return typeof rawStock === 'string' ? JSON.parse(rawStock) : rawStock
    }
    catch {
        return null
    }
}

export function isSizeAvailable (stock, size) {
    if (!stock) return true
    if ( stock[size] === undefined) return true
    return stock[size] === true
}

export function isProductAvailable (stock) {
    if (!stock) return true
        return ['small', 'medium', 'large'].some(s => isSizeAvailable(stock, s))
}