import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'qvf7tpyq',
  dataset:   'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  if (!source || !source.asset) return { url: () => "" }; 
  return builder.image(source)
}
