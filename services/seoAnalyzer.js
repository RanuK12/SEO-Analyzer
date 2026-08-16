import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';

export async function analyzeSEO(url) {
  try {
    const rawhtml = await (await globalThis.fetch(url)).text();
    const dom = new JSDOM(rawhtml);
  const { document } = dom.window;
    const title = document.querySelector('title')?.textContent?.trim() || 'No title found';
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || 'No meta description';
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent.trim());
    const links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(link => link !== undefined && link !== '');
    const wordsCount = rawhtml.split(' ').length;

    return {
      url,
      title,
      metaDescription,
      headings,
      links,
      wordsCount,
      screenshots: []
    };
  } catch (error) {
    return {
      url,
      error: error.message,
      html: null,
      title: null,
      metaDescription: null,
      headings: [],
      links: [],
      wordsCount: 0,
      screenshots: []
    };
  }
}