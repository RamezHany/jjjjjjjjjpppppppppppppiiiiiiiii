import type { News } from '@/interfaces/News';

let dataNews: Array<News> = [];
let lastLoadedLocale: string = '';

// This function will be called to load the data
export async function loadNewsData(locale: string): Promise<News[]> {
    try {
        console.log(`Loading news data with locale: ${locale}, last loaded locale: ${lastLoadedLocale}`);
        
        // Always reload if locale changes or if it's the first load
        const shouldReload = locale !== lastLoadedLocale || dataNews.length === 0;
        
        if (shouldReload) {
            console.log(`Reloading news data for locale: ${locale}`);
            const response = await fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/refs/heads/main/news.json');
            const data = await response.json();
            
            // Process the data based on locale
            dataNews = data.news.map((item: any) => {
                if (locale === 'ar') {
                    return {
                        ...item,
                        title: item.title_ar || item.title,
                        shortDescription: item.shortDescription_ar || item.shortDescription,
                        description: item.description_ar || item.description
                    };
                } else {
                    return {
                        ...item,
                        // Keep English as default
                    };
                }
            });
            
            lastLoadedLocale = locale;
            console.log(`News data loaded successfully for locale: ${locale}, items: ${dataNews.length}`);
        } else {
            console.log(`Using cached news data for locale: ${locale}, items: ${dataNews.length}`);
        }
        
        return dataNews;
    } catch (error) {
        console.error('Error loading news data:', error);
        return [];
    }
}

// Initial load of data (optional, can be removed if not needed)
if (typeof window !== 'undefined') {
    loadNewsData('en'); // Default to English
}

export { dataNews };