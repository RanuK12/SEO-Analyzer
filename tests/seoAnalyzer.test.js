import { describe, it, expect, beforeEach } from 'jest';
import { SEOAnalyzer } from '../services/seoAnalyzer.js';

// Mock de Firecrawl
jest.mock('firecrawl-js');

describe('SEOAnalyzer', () => {
  let seoAnalyzer;
  
  beforeEach(() => {
    seoAnalyzer = new SEOAnalyzer('test-api-key');
  });

  describe('validateURL', () => {
    it('debe validar URLs HTTPS válidas', () => {
      expect(seoAnalyzer.validateURL('https://example.com')).toBe(true);
    });

    it('debe validar URLs HTTP válidas', () => {
      expect(seoAnalyzer.validateURL('http://example.com')).toBe(true);
    });

    it('debe rechazar URLs inválidas', () => {
      expect(seoAnalyzer.validateURL('not-a-url')).toBe(false);
    });
  });

  describe('analyzeBasicInfo', () => {
    it('debe analizar información básica correctamente', () => {
      const mockData = {
        title: 'Test Title',
        description: 'Test description',
        content: 'This is test content with some keywords'
      };

      const result = seoAnalyzer.analyzeBasicInfo(mockData);

      expect(result.title).toBe('Test Title');
      expect(result.titleLength).toBe(10);
      expect(result.description).toBe('Test description');
      expect(result.descriptionLength).toBe(18);
      expect(result.wordCount).toBe(8);
    });
  });

  describe('analyzeTechnicalSEO', () => {
    it('debe analizar SEO técnico correctamente', () => {
      const mockData = {
        content: `
          <html>
            <head>
              <link rel="canonical" href="https://example.com/canonical" />
              <meta name="robots" content="index, follow" />
            </head>
            <body>
              <h1>Main Title</h1>
              <h2>Subtitle</h2>
              <img src="image.jpg" alt="test image" />
              <a href="internal-link">Internal Link</a>
              <a href="https://external.com">External Link</a>
            </body>
          </html>
        `
      };

      const $ = require('cheerio').load(mockData.content);
      const result = seoAnalyzer.analyzeTechnicalSEO(mockData);

      expect(result.hasCanonical).toBe(true);
      expect(result.hasRobots).toBe(true);
      expect(result.headings.h1).toBe(1);
      expect(result.headings.h2).toBe(1);
      expect(result.images.total).toBe(1);
      expect(result.images.withAlt).toBe(1);
      expect(result.links.total).toBe(2);
      expect(result.links.internal).toBe(1);
      expect(result.links.external).toBe(1);
    });
  });

  describe('analyzeOnPageSEO', () => {
    it('debe analizar SEO On-Page correctamente', () => {
      const mockData = {
        url: 'https://example.com/page',
        content: `
          <html>
            <head>
              <meta name="description" content="Test meta description" />
            </head>
            <body>
              <meta name="keywords" content="test, seo, analyzer" />
            </body>
          </html>
        `
      };

      const $ = require('cheerio').load(mockData.content);
      const result = seoAnalyzer.analyzeOnPageSEO(mockData);

      expect(result.urlStructure.hasCleanUrls).toBe(true);
      expect(result.urlStructure.urlDepth).toBe(1);
      expect(result.urlStructure.hasQueryParams).toBe(false);
    });
  });
});