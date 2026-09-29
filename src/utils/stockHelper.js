export function parseStock(rawStock) {
    if (!rawStock) return null
    try {
        return typeof rawStock === 'string' ? JSON.parse(rawStock) : rawStock
    } catch {
        return null
    }
}

export function isSizeAvailable(stock, size) {
    if (!stock) return true
    if (stock[size] === undefined) return true
    return stock[size] === true
}

// Now works with ANY sizes — not hardcoded to small/medium/large
export function isProductAvailable(stock) {
    if (!stock) return true
    const sizes = Object.keys(stock)
    if (sizes.length === 0) return true
    return sizes.some(s => isSizeAvailable(stock, s))
}