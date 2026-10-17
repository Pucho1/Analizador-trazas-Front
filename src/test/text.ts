/**
 * Intl separates numbers from units with non-breaking spaces, while Testing Library normalises
 * DOM text to plain spaces: compare formatted values through this.
 */
export function plainSpaces(text: string): string {
  return text.replace(/\s/g, ' ')
}
