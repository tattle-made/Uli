export default function generateDisplayName(slug) {
    if (!slug) return ""
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }
  