import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';


export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      );
    }

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    const title = $('title').text() ||
                  $('meta[property="og:title"]').attr('content') || 
                  'Título no disponible';

    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') || 
                       '';

    let image = $('meta[property="og:image"]').attr('content') ||
                $('link[rel="icon"]').attr('href') ||
                $('link[rel="shortcut icon"]').attr('href') || 
                '/default-icon.png'; 

    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, url).href;
      } catch (error) {
        console.error('Error converting image URL:', error);
        image = '/default-icon.png';
      }
    }

    if (!image || image === '/default-icon.png') {
      try {
        const faviconUrl = new URL('/favicon.ico', url).href;
        const faviconResponse = await axios.head(faviconUrl);
        if (faviconResponse.status === 200) {
          image = faviconUrl;
        }
      } catch {
        image = '/default-icon.png';
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        title: title.trim().substring(0, 255),
        description: description.trim().substring(0, 500), 
        image: image || '/default-icon.png', 
        url 
      }
    });

  } catch (error) {
    console.error('Error scraping URL:', error);
    

    return NextResponse.json({
      success: true,
      data: {
        title: 'Título no disponible',
        description: '',
        image: '/default-icon.png',
        url
      }
    });
  }
}