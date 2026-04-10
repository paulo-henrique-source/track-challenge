type JwtPayload = {
  exp?: number
}

function decodeBase64(value: string) {
  if (typeof window !== "undefined") {
    return window.atob(value)
  }

  return Buffer.from(value, "base64").toString("utf-8")
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".")
  if (parts.length < 2) {
    return null
  }

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    const payloadRaw = decodeBase64(padded)
    const payload = JSON.parse(payloadRaw) as JwtPayload
    return payload
  } catch {
    return null
  }
}

export function getJwtExpiration(token: string): number | null {
  const payload = decodeJwtPayload(token)
  const exp = payload?.exp

  if (typeof exp !== "number" || Number.isNaN(exp)) {
    return null
  }

  return exp
}

export function isTokenExpired(expirationUnixSeconds: number, leewaySeconds = 5) {
  const nowUnixSeconds = Math.floor(Date.now() / 1000)
  return expirationUnixSeconds <= nowUnixSeconds + leewaySeconds
}
