import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface ScrapeRequest {
  url: string;
}

interface ScrapeResult {
  title: string;
  description: string;
  image: string;
  url: string;
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function scrapeYouTube(url: string): Promise<ScrapeResult | null> {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    const res = await fetch(oembedUrl);
    if (!res.ok) return null;

    const data = await res.json();
    return {
      title: data.title,
      description: `Video de YouTube: ${data.title}`,
      image: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      url
    };
  } catch {
    return null;
  }
}

async function scrapeGenericUrl(url: string): Promise<ScrapeResult> {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const $ = cheerio.load(html);

  let image = $('meta[property="og:image"]').attr('content') || '/default-icon.png';
  if (image && !image.startsWith('http')) {
    try { image = new URL(image, url).href; } catch { image = '/default-icon.png'; }
  }

  return {
    title: ($('meta[property="og:title"]').attr('content') ||
            $('title').text() ||
            'Título no disponible').slice(0, 255),
    description: ($('meta[property="og:description"]').attr('content') || '').slice(0, 500),
    image,
    url
  };
}

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as ScrapeRequest;
    if (!url) return NextResponse.json({ success: false, error: 'URL requerida' }, { status: 400 });

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const ytData = await scrapeYouTube(url);
      if (ytData) return NextResponse.json({ success: true, data: ytData });
    }

    const data = await scrapeGenericUrl(url);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
    return NextResponse.json({ success: false, error: "Error desconocido" });
  }
}
