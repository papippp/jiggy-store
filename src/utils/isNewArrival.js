

export default function isNewArrival(createdAt) {
    if(!createdAt) return false
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return new Date(createdAt) > sevenDaysAgo
}
