import { GetServerSideProps } from 'next'
import { dataNews as news } from '@/components/home/home_news.data'

const generateSiteMap = (posts: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://igcce.com</loc>
     </url>
     ${posts
       .map(({ slug }) => {
         return `
       <url>
           <loc>https://igcce.com/news/${slug}</loc>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSiteMap(news)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
