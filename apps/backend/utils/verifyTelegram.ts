import crypto from 'crypto'

export function verifyTelegramAuth(data: Record<string, string>, botToken: string): boolean {
    const { hash, ...rest } = data

    const sortedData = Object.keys(rest)
        .sort()
        .map(key => `${key}=${rest[key]}`)
        .join('\n')

    const secret = crypto.createHash('sha256').update(botToken).digest()
    const hmac = crypto.createHmac('sha256', secret).update(sortedData).digest('hex')

    return hmac === hash
}
