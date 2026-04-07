import type { MetadataRoute } from 'next';

const BASE_URL = 'https://nexomarket.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/categorias`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ofertas`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sobre-nosotros`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/ayuda`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/registro`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/terminos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/legal/privacidad`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/legal/cookies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/legal/aviso-legal`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/legal/condiciones-vendedor`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
  ];

  return staticPages;
}
