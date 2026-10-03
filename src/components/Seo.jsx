import { useEffect } from 'react'
import { applySeo } from '../lib/seo.js'

export default function Seo({ title, titleFull, description, path, image, type, noindex, jsonLd }) {
  useEffect(() => {
    applySeo({ title, titleFull, description, path, image, type, noindex, jsonLd })
  }, [title, titleFull, description, path, image, type, noindex, jsonLd])

  return null
}