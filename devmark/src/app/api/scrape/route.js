import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Function to extract YouTube video ID from URL
function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Specific function for YouTube using oEmbed API
async function scrapeYouTube(url) {
  try {
    const videoId = extractYouTubeId(url);
    
    if (videoId) {
      console.log('Using YouTube oEmbed API for video:', videoId);
      
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      
      const response = await axios.get(oembedUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const data = response.data;
      
      // Build high-quality thumbnail URL
      let thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      
      // Check if high-quality image exists
      try {
        await axios.head(thumbnailUrl);
      } catch {
        // If not exists, use default thumbnail
        thumbnailUrl = data.thumbnail_url;
      }

      return {
        title: data.title,
        description: `YouTube video: ${data.title}`,
        image: thumbnailUrl,
        url
      };
    }
  } catch (error) {
    console.error('Error with YouTube oEmbed:', error.message);
  }

  return null;
}

/**
 * API route for scraping metadata from URLs
 * Supports YouTube videos with special handling and general web pages
 */
export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log('Scraping URL:', url);

    // Handle YouTube links with special processing
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      console.log('YouTube detected, using special method...');
      
      const youtubeData = await scrapeYouTube(url);
      if (youtubeData) {
        console.log('YouTube data obtained via oEmbed:', youtubeData.title);
        return NextResponse.json({
          success: true,
          data: youtubeData
        });
      }
      console.log('YouTube oEmbed failed, continuing with normal scraping...');
    }

    // Headers for web scraping to avoid blocking
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

    // Download HTML content
    const response = await axios.get(url, {
      timeout: 15000,
      headers: headers
    });

    console.log('HTML downloaded successfully, status:', response.status);

    // Load HTML into cheerio for parsing
    const $ = cheerio.load(response.data);

    // Extract title with fallbacks
    const title = $('meta[property="og:title"]').attr('content') ||
                  $('meta[name="twitter:title"]').attr('content') ||
                  $('title').text()?.trim() ||
                  'Title not available';

    // Extract description with fallbacks
    const description = $('meta[property="og:description"]').attr('content') ||
                       $('meta[name="twitter:description"]').attr('content') ||
                       $('meta[name="description"]').attr('content') ||
                       '';

    // Extract image with fallbacks
    let image = $('meta[property="og:image"]').attr('content') ||
                $('meta[name="twitter:image"]').attr('content') ||
                $('link[rel="icon"]').attr('href') ||
                $('link[rel="shortcut icon"]').attr('href') ||
                '/default-icon.png';

    // Convert relative URLs to absolute
    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, url).href;
      } catch (error) {
        console.error('Error converting image URL:', error.message);
        image = '/default-icon.png';
      }
    }

    // If no image found, try to get favicon
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

    // Prepare final result with length limits
    const result = {
      title: title.substring(0, 255),
      description: description.substring(0, 500),
      image: image || '/default-icon.png',
      url
    };

    console.log('Data extracted:', {
      title: result.title.substring(0, 50) + '...',
      description: result.description.substring(0, 50) + '...',
      image: result.image
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error scraping URL:', error.message);
    
    // Return default data on error
    return NextResponse.json({
      success: true,
      data: {
        title: 'Title not available',
        description: '',
        image: '/default-icon.png',
        url: url || ''
      }
    });
  }
}