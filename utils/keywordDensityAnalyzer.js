/**
 * Keyword Density Analyzer for SEO Optimization
 * Ensures 1-2% keyword density without over-optimization
 */

export class KeywordDensityAnalyzer {
  constructor() {
    this.targetKeywords = [
      'website laten maken',
      'webdesign nederland',
      '3d websites',
      'wordpress website',
      'responsive webdesign',
      'professionele website',
      'webbureau',
      'website ontwikkeling'
    ];
    
    this.lsiKeywords = [
      'online marketing',
      'zoekmachine optimalisatie',
      'gebruiksvriendelijk',
      'conversie',
      'webshop',
      'cms',
      'hosting',
      'onderhoud',
      'seo',
      'responsive design',
      'mobile first',
      'gebruikerservaring',
      'webontwikkeling',
      'digitale strategie'
    ];
  }

  analyzeContent(text) {
    const cleanText = this.cleanText(text);
    const wordCount = this.countWords(cleanText);
    const results = {
      totalWords: wordCount,
      keywords: {},
      lsiKeywords: {},
      recommendations: []
    };

    // Analyze target keywords
    this.targetKeywords.forEach(keyword => {
      const count = this.countKeywordOccurrences(cleanText, keyword);
      const density = (count / wordCount) * 100;
      
      results.keywords[keyword] = {
        count,
        density: density.toFixed(2),
        status: this.getStatus(density)
      };

      // Add recommendations
      if (density < 0.5) {
        results.recommendations.push(`Increase usage of "${keyword}" (current: ${density.toFixed(2)}%)`);
      } else if (density > 2.5) {
        results.recommendations.push(`Reduce usage of "${keyword}" to avoid over-optimization (current: ${density.toFixed(2)}%)`);
      }
    });

    // Analyze LSI keywords
    this.lsiKeywords.forEach(keyword => {
      const count = this.countKeywordOccurrences(cleanText, keyword);
      if (count > 0) {
        results.lsiKeywords[keyword] = count;
      }
    });

    return results;
  }

  cleanText(text) {
    // Remove HTML tags and extra whitespace
    return text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();
  }

  countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  countKeywordOccurrences(text, keyword) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  getStatus(density) {
    if (density < 0.5) return 'low';
    if (density >= 0.5 && density <= 2.0) return 'optimal';
    return 'high';
  }

  // Analyze page in browser
  analyzePage() {
    if (typeof window === 'undefined') return;
    
    const content = document.querySelector('main')?.innerText || document.body.innerText;
    const results = this.analyzeContent(content);
    
    return results;
  }
}

// Run analysis in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const analyzer = new KeywordDensityAnalyzer();
      analyzer.analyzePage();
    });
  }
}
