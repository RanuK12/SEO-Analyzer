import { firecrawl } from 'firecrawl-js';
import { JSDOM } from 'jsdom';
import axios from 'axios';
import cheerio from 'cheerio';
import logger from '../utils/logger.js';

export class SEOAnalyzer {
  constructor(firecrawlApiKey) {
    this.firecrawl = new firecrawl({ apiKey: firecrawlApiKey });
    this.results = {};
  }

  async analyzeURL(url) {
    try {
      logger.info(`Iniciando análisis SEO para: ${url}`);
      
      // Validar URL
      if (!this.validateURL(url)) {
        throw new Error('URL inválida');
      }

      // Obtener contenido con Firecrawl
      const scrapedData = await this.firecrawl.scrapeUrl(url);
      
      // Análisis SEO
      const analysis = {
        url: url,
        timestamp: new Date().toISOString(),
        basicInfo: this.analyzeBasicInfo(scrapedData),
        technicalSEO: this.analyzeTechnicalSEO(scrapedData),
        onPageSEO: this.analyzeOnPageSEO(scrapedData),
        contentAnalysis: this.analyzeContent(scrapedData),
        performance: await this.analyzePerformance(url),
        recommendations: this.generateRecommendations(scrapedData)
      };

      this.results[url] = analysis;
      logger.info(`Análisis completado para: ${url}`);
      return analysis;
    } catch (error) {
      logger.error(`Error en análisis SEO: ${error.message}`);
      throw error;
    }
  }

  validateURL(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  analyzeBasicInfo(data) {
    return {
      titleLength: data.title ? data.title.length : 0,
      title: data.title || '',
      descriptionLength: data.description ? data.description.length : 0,
      description: data.description || '',
      keywords: this.extractKeywords(data.content || ''),
      wordCount: data.content ? data.content.split(/\s+/).length : 0,
      loadTime: data.loadTime || 0
    };
  }

  analyzeTechnicalSEO(data) {
    const $ = cheerio.load(data.content || '');
    
    return {
      hasSSL: data.url.startsWith('https:'),
      hasCanonical: $('link[rel="canonical"]').length > 0,
      hasRobots: $('meta[name="robots"]').length > 0,
      hasXmlSitemap: $('link[rel="sitemap"]').length > 0,
      hasStructuredData: $('script[type="application/ld+json"]').length > 0,
      headings: this.analyzeHeadings($),
      images: this.analyzeImages($),
      links: this.analyzeLinks($)
    };
  }

  analyzeOnPageSEO(data) {
    const $ = cheerio.load(data.content || '');
    
    return {
      metaTags: this.analyzeMetaTags($),
      urlStructure: this.analyzeURLStructure(data.url),
      mobileFriendly: this.checkMobileFriendliness($),
      pageSpeed: data.pageSpeed || 'unknown'
    };
  }

  analyzeContent(data) {
    const content = data.content || '';
    
    return {
      keywordDensity: this.calculateKeywordDensity(content),
      contentLength: content.length,
      readability: this.calculateReadability(content),
      hasH1: content.includes('<h1'),
      hasH2: content.includes('<h2'),
      hasLists: content.includes('<ul') || content.includes('<ol'),
      hasInternalLinks: (content.match(/href="[^"]*"/g) || []).filter(link => 
        link.includes(domain)).length
    };
  }

  async analyzePerformance(url) {
    try {
      const startTime = Date.now();
      const response = await axios.get(url, { 
        timeout: 10000,
        validateStatus: () => true 
      });
      const loadTime = Date.now() - startTime;
      
      return {
        statusCode: response.status,
        loadTime: loadTime,
        size: JSON.stringify(response.data).length,
        hasCompression: response.headers['content-encoding'] !== undefined
      };
    } catch (error) {
      return {
        statusCode: error.response?.status || 0,
        loadTime: 0,
        size: 0,
        hasCompression: false,
        error: error.message
      };
    }
  }

  generateRecommendations(data) {
    const recommendations = [];
    const basicInfo = this.analyzeBasicInfo(data);
    const technical = this.analyzeTechnicalSEO(data);
    
    if (basicInfo.titleLength < 30 || basicInfo.titleLength > 60) {
      recommendations.push({
        type: 'title',
        priority: 'high',
        message: 'El título debe tener entre 30-60 caracteres'
      });
    }
    
    if (basicInfo.descriptionLength < 120 || basicInfo.descriptionLength > 160) {
      recommendations.push({
        type: 'description',
        priority: 'high',
        message: 'La descripción debe tener entre 120-160 caracteres'
      });
    }
    
    if (!technical.hasCanonical) {
      recommendations.push({
        type: 'canonical',
        priority: 'medium',
        message: 'Añadir etiqueta canonical para evitar contenido duplicado'
      });
    }
    
    if (!technical.hasStructuredData) {
      recommendations.push({
        type: 'structured-data',
        priority: 'medium',
        message: 'Implementar datos estructurados para mejorar el rich snippet'
      });
    }
    
    return recommendations;
  }

  // Métodos auxiliares
  extractKeywords(content) {
    // Implementar extracción de palabras clave
    return [];
  }

  analyzeHeadings($) {
    const headings = {};
    for (let i = 1; i <= 6; i++) {
      headings[`h${i}`] = $(`h${i}`).length;
    }
    return headings;
  }

  analyzeImages($) {
    const images = $('img').map((i, el) => ({
      src: $(el).attr('src'),
      alt: $(el).attr('alt'),
      hasAlt: !!$(el).attr('alt')
    })).get();
    
    return {
      total: images.length,
      withAlt: images.filter(img => img.hasAlt).length,
      withoutAlt: images.filter(img => !img.hasAlt).length
    };
  }

  analyzeLinks($) {
    const links = $('a').map((i, el) => ({
      text: $(el).text(),
      href: $(el).attr('href')
    })).get();
    
    return {
      total: links.length,
      internal: links.filter(link => link.href && !link.href.startsWith('http')).length,
      external: links.filter(link => link.href && link.href.startsWith('http')).length
    };
  }

  analyzeMetaTags($) {
    const metaTags = $('meta').map((i, el) => ({
      name: $(el).attr('name'),
      content: $(el).attr('content')
    })).get();
    
    return metaTags;
  }

  analyzeURLStructure(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    return {
      hasCleanUrls: !path.includes('.html'),
      urlDepth: path.split('/').length - 1,
      hasQueryParams: urlObj.search.length > 0
    };
  }

  checkMobileFriendliness($) {
    // Implementar verificación de mobile-friendliness
    return true;
  }

  calculateKeywordDensity(content) {
    // Implementar cálculo de densidad de palabras clave
    return {};
  }

  calculateReadability(content) {
    // Implementar cálculo de legibilidad
    return {
      score: 0,
      level: 'unknown'
    };
  }
}