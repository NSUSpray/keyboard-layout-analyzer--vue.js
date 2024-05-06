import { z } from 'zod'
import { kbtype } from './constants'

const keyIdSchema = z.number().int().min(-1).finite()

const charCodeSchema = z.number().int().finite().optional()

const urlSchema = z.string().url().nullish().or(z.literal(''))

const fingerStartSchema = z.object(Object.fromEntries(
  [ ...Array(11).keys() ].map( i => [i + 1, keyIdSchema] )
))

const keySchema = z.object({
  id: keyIdSchema.optional(),
  finger: z.number().int().min(1).max(10),
  primary: charCodeSchema,
  shift: charCodeSchema,
  altGr: charCodeSchema,
  shiftAltGr: charCodeSchema,
})

const keyFingerSchema = z.object({
  id: keyIdSchema.optional(),
  finger: z.number().int().min(1).max(10),
})

export const layoutSchema = z.object({
  label: z.string(),
  author: z.string(),
  authorUrl: urlSchema,
  moreInfoUrl: urlSchema,
  moreInfoText: z.string().nullish(),
  keyboardType: z.enum(Object.keys(kbtype)),
  fingerStart: fingerStartSchema,
  keys: keySchema.array(),
})

export const fingeringSchema = z.object({
  keyboardType: z.enum(Object.keys(kbtype)),
  fingerStart: fingerStartSchema,
  keys: keyFingerSchema.array(),
})

export const setSchema = z.object({
  name: z.string().nullable(),
  layouts: layoutSchema.array().length(6),
})
