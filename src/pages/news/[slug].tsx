import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { loadNewsData } from '@/components/home/home_news.data';
import { format } from 'date-fns';
import { MainLayout } from '@/components/layout';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'next-i18next';
import { GetStaticProps, GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { News } from '@/interfaces/News';

// Styled Paper for the News Detail Container
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: theme.palette.background.paper,
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    },
}));

interface NewsDetailProps {
    initialNewsItem?: News;
}

const NewsDetail: FC<NewsDetailProps> = ({ initialNewsItem }) => {
    const router = useRouter();
    const { slug } = router.query;
    const { t } = useTranslation('common');
    const { locale } = router;
    const [newsItem, setNewsItem] = useState<News | null>(initialNewsItem || null);
    const [currentLocale, setCurrentLocale] = useState<string | undefined>(locale);
    const [loading, setLoading] = useState<boolean>(!initialNewsItem);

    useEffect(() => {
        // If we already have the news item from props and not changing locale, no need to fetch
        if (initialNewsItem && currentLocale === locale) {
            console.log('Using initialNewsItem from props:', initialNewsItem.title);
            setNewsItem(initialNewsItem);
            setLoading(false);
            return;
        }

        // If the page is in fallback mode and slug is not yet available, don't do anything
        if (router.isFallback || !slug) {
            console.log('In fallback mode or slug not available yet:', { isFallback: router.isFallback, slug });
            return;
        }

        // Check if locale has changed
        if (currentLocale !== locale) {
            console.log(`Locale changed from ${currentLocale} to ${locale}`);
            setCurrentLocale(locale);
        }
        
        const loadNews = async () => {
            setLoading(true);
            console.log(`Loading news data with locale: ${locale}, slug: ${slug}`);
            try {
                const data = await loadNewsData(locale || 'en'); // Fetch data based on the current locale
                console.log(`Loaded ${data.length} news items`);
                
                const item = data.find((item) => item.slug === slug);
                console.log(`Found news item for slug ${slug}:`, item ? 'Yes' : 'No');
                
                setNewsItem(item || null);
                
                // If item not found, redirect to news page
                if (!item) {
                    console.log(`News item with slug ${slug} not found, redirecting...`);
                    router.push('/news');
                }
            } catch (error) {
                console.error('Error loading news item:', error);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [locale, slug, currentLocale, router, initialNewsItem]); // Added initialNewsItem to dependencies

    // Show loading state when in fallback mode
    if (router.isFallback) {
        console.log('Rendering fallback state');
        return (
            <MainLayout>
                <Container>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <Typography variant="h4" align="center">
                            {t('common.loading', 'جاري التحميل...')}
                        </Typography>
                    </Box>
                </Container>
            </MainLayout>
        );
    }

    // Show loading state when loading data but not in fallback mode
    if (loading && !router.isFallback) {
        console.log('Rendering loading state (not fallback)');
        return (
            <MainLayout>
                <Container>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <Typography variant="h4" align="center">
                            {t('common.loading', 'جاري التحميل...')}
                        </Typography>
                    </Box>
                </Container>
            </MainLayout>
        );
    }

    if (!newsItem) {
        console.log('Rendering not found state');
        return (
            <MainLayout>
                <Container>
                    <Typography variant="h4" align="center" sx={{ my: 8 }}>
                        {t('news.notFound', 'الخبر غير موجود')}
                    </Typography>
                </Container>
            </MainLayout>
        );
    }

    console.log('Rendering news item:', newsItem.title);

    return (
        <MainLayout>
            <Box component="article" sx={{ backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)', paddingTop: '40px' }}>
                <Box sx={{ py: { xs: 6, md: 10 } }}>
                    <Container maxWidth="lg">
                        <StyledPaper>
                            <Grid container spacing={4}>
                                {/* Title and Date */}
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h1"
                                        component="h1"
                                        sx={{
                                            fontSize: { xs: 32, md: 48 },
                                            mb: 2,
                                            fontWeight: 'bold',
                                            color: 'primary.main',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {newsItem.title}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        sx={{ mb: 4, textAlign: 'center' }}
                                    >
                                        {format(new Date(newsItem.date), 'dd/MM/yyyy')}
                                    </Typography>
                                    <Divider sx={{ mb: 4 }} />
                                </Grid>

                                {/* Main Image */}
                                {newsItem.image.slice(0, 1).map((img, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                height: { xs: 250, md: 500 },
                                                maxWidth: '1000px',
                                                margin: '0 auto',
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.3s ease-in-out',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                },
                                            }}
                                        >
                                            <Image
                                                src={img.url}
                                                alt={`${newsItem.title} - صورة ${index + 1}`}
                                                width={800}
                                                height={600}
                                                priority
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}

                                {/* Description */}
                                <Grid item xs={12}>
                                    <Box sx={{ mt: 4 }}>
                                        {newsItem.description.map((paragraph, index) => (
                                            <Typography
                                                key={index}
                                                sx={{
                                                    mb: 3,
                                                    color: 'text.secondary',
                                                    fontSize: '1.1rem',
                                                    lineHeight: 1.8,
                                                    textAlign: 'justify',
                                                }}
                                            >
                                                {paragraph}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    </Container>
                </Box>
            </Box>
        </MainLayout>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        // Fetch data from a single file, just like in home_news.data.tsx
        const response = await fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/refs/heads/main/news.json');
        const data = await response.json();

        console.log(`Generating static paths for ${data.news.length} news items`);

        // Create paths for both Arabic and English locales with proper typing
        const paths: { params: { slug: string }; locale: string }[] = [];
        
        // Add paths for Arabic locale
        data.news.forEach((news: any) => {
            paths.push({
                params: { slug: news.slug },
                locale: 'ar',
            });
            
            // Also add English locale path
            paths.push({
                params: { slug: news.slug },
                locale: 'en',
            });
        });

        console.log(`Generated ${paths.length} static paths`);

        return {
            paths,
            fallback: false, // Changed back to false to ensure all paths are pre-rendered
        };
    } catch (error) {
        console.error('Error generating static paths:', error);
        return {
            paths: [],
            fallback: false,
        };
    }
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
    try {
        // Fetch the news data to check if the slug exists
        const response = await fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/refs/heads/main/news.json');
        const data = await response.json();
        
        const slug = params?.slug as string;
        console.log(`getStaticProps for slug: ${slug}, locale: ${locale}`);
        
        const newsItem = data.news.find((item: any) => item.slug === slug);
        
        // If the news item doesn't exist, return notFound
        if (!newsItem) {
            console.log(`News item with slug ${slug} not found`);
            return {
                notFound: true,
            };
        }
        
        console.log(`Found news item for slug ${slug}: ${newsItem.title}`);
        
        return {
            props: {
                ...(await serverSideTranslations(locale || 'ar', ['common'])),
                initialNewsItem: newsItem, // Pass the news item directly to avoid client-side fetching
            },
            // Revalidate every hour to check for new content
            revalidate: 300,
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            props: {
                ...(await serverSideTranslations(locale || 'ar', ['common'])),
            },
            revalidate: 300,
        };
    }
};

export default NewsDetail;
