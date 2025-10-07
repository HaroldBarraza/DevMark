import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Función para extraer ID de YouTube
function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Función específica para YouTube usando oEmbed API
async function scrapeYouTube(url) {
  try {
    const videoId = extractYouTubeId(url);
    
    if (videoId) {
      console.log('🎥 Usando YouTube oEmbed API para video:', videoId);
      
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      
      const response = await axios.get(oembedUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const data = response.data;
      
      // Construir URL de thumbnail en alta calidad
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      
      // Verificar si la imagen de alta calidad existe
      try {
        await axios.head(thumbnailUrl);
      } catch {
        // Si no existe, usar la thumbnail por defecto
        thumbnailUrl = data.thumbnail_url;
      }

      return {
        title: data.title,
        description: `Video de YouTube: ${data.title}`,
        image: thumbnailUrl,
        url
      };
    }
  } catch (error) {
    console.error('❌ Error con YouTube oEmbed:', error.message);
  }

  return null;
}

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      );
    }

    console.log('🔗 Scraping URL:', url);

    // manejar links de youtube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      console.log('🎥 Detectado YouTube, usando método especial...');
      
      const youtubeData = await scrapeYouTube(url);
      if (youtubeData) {
        console.log('✅ YouTube data obtenida via oEmbed:', youtubeData.title);
        return NextResponse.json({
          success: true,
          data: youtubeData
        });
      }
      console.log('🔄 YouTube oEmbed falló, continuando con scraping normal...');
    }

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
    };

    const response = await axios.get(url, {
      timeout: 15000,
      headers: headers
    });

    console.log('✅ HTML descargado correctamente, status:', response.status);

    const $ = cheerio.load(response.data);

    const title = $('meta[property="og:title"]').attr('content') ||
                  $('meta[name="twitter:title"]').attr('content') ||
                  $('title').text()?.trim() ||
                  'Título no disponible';

    const description = $('meta[property="og:description"]').attr('content') ||
                       $('meta[name="twitter:description"]').attr('content') ||
                       $('meta[name="description"]').attr('content') ||
                       '';

    let image = $('meta[property="og:image"]').attr('content') ||
                $('meta[name="twitter:image"]').attr('content') ||
                $('link[rel="icon"]').attr('href') ||
                $('link[rel="shortcut icon"]').attr('href') ||
                '/default-icon.png';

    // Convertir URL
    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, url).href;
      } catch (error) {
        console.error('❌ Error convirtiendo imagen:', error.message);
        image = '/default-icon.png';
      }
    }

    // si no hay imagen optener favicon
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

    const result = {
      title: title.substring(0, 255),
      description: description.substring(0, 500),
      image: image || '/default-icon.png',
      url
    };

    console.log('📊 Datos extraídos:', {
      title: result.title.substring(0, 50) + '...',
      description: result.description.substring(0, 50) + '...',
      image: result.image
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('💥 Error scraping URL:', error.message);
    
    return NextResponse.json({
      success: true,
      data: {
        title: 'Título no disponible',
        description: '',
        image: '/default-icon.png',
        url: url || ''
      }
    });
  }
}