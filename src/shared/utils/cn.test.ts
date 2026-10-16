import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class names and drops falsy ones', () => {
    expect(cn('px-2', false, undefined, 'text-sm')).toBe('px-2 text-sm')
  })

  it('keeps the last of conflicting Tailwind utilities', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})
