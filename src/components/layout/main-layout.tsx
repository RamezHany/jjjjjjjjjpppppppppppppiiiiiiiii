import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { defaultSEO } from '@/utils/seo.config'
import Head from 'next/head'

interface Props {
  children: ReactNode
  seo?: {
    title?: string
    description?: string
    openGraph?: any
  }
}

const MainLayout: FC<Props> = ({ children, seo = defaultSEO }) => {
  return (
    <Box component="div">
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:type" content={seo.openGraph?.type || defaultSEO.openGraph.type} />
        <meta property="og:title" content={seo.openGraph?.title || seo.title} />
        <meta property="og:description" content={seo.openGraph?.description || seo.description} />
        <meta property="og:site_name" content={defaultSEO.openGraph.site_name} />
        <meta property="og:url" content={defaultSEO.openGraph.url} />
        <meta name="twitter:card" content={defaultSEO.twitter.cardType} />
        <meta name="twitter:site" content={defaultSEO.twitter.site} />
        <meta name="twitter:creator" content={defaultSEO.twitter.handle} />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        {defaultSEO.additionalMetaTags.map((tag, index) => (
          <meta key={index} name={tag.name} content={tag.content} />
        ))}
        <link rel="canonical" href={defaultSEO.openGraph.url} />
      </Head>
      <Header />
      <Box component="main">{children}</Box>
      <Footer />
    </Box>
  )
}

export default MainLayout
