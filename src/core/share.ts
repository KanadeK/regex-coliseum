import { z } from 'zod'

const payloadSchema = z.object({ challenge: z.string().regex(/^arena-\d{2}$/) })
const encode = (value: string) => btoa(encodeURIComponent(value))
const decode = (value: string) => decodeURIComponent(atob(value))

export const createShareHash = (challengeId: string): string => `#challenge=${encode(JSON.stringify({ challenge: challengeId }))}`
export const readShareHash = (hash: string): string | undefined => {
  const value = new URLSearchParams(hash.replace(/^#/, '')).get('challenge')
  if (!value) return undefined
  try { return payloadSchema.parse(JSON.parse(decode(value))).challenge } catch { return undefined }
}
