const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'

export function generateID() {
    const res = []
    for (let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * 64)
        const randomChar = charSet[index]
        res.push(randomChar)
    }
    return res.join('')
}
