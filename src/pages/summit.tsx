import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NextPageWithLayout } from '@/interfaces/layout';
import { MainLayout } from '@/components/layout';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(8),
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to right, #283A5F, #1976d2)',
  color: theme.palette.common.white,
  padding: theme.spacing(8, 0),
  marginBottom: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const IntroCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

interface ConfigData {
  vimeoLink: string;
  doctorImage: string;
  summitImage: string;
}

const SummitPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale, pathname } = router;
  const isRtl = locale === 'ar';

  // Config state
  const [config, setConfig] = useState<ConfigData>({ 
    vimeoLink: '', 
    doctorImage: '', 
    summitImage: '/images/summit.jpg' 
  });

  useEffect(() => {
    // Fetch config data
    fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/refs/heads/main/config.json')
      .then(response => response.json())
      .then(data => setConfig(data))
      .catch(error => console.error('Error loading config:', error));
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    position: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);

    try {
      // Direct Google Apps Script web app URL - replace with your actual deployed script URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzslKJcRQYEKEKR8IN1pnjFQWvVI-3eAZ5dPhYtuUTzKbtW4n8SDjVqsk9qlfTice2N/exec';
      
      // Create form data for submission
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('formType', 'summit'); // Specify that this is a summit form
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('phone', formData.phone || '');
      formDataToSubmit.append('organization', formData.organization || '');
      formDataToSubmit.append('position', formData.position || '');
      formDataToSubmit.append('message', formData.message || '');
      
      // Send data to Google Sheets
      const response = await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // This is important for CORS issues
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSubmit.toString(),
      });
      
      // Since no-cors mode doesn't return readable response, we assume success if no error is thrown
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        position: '',
        phone: '',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('summit.title')} | {t('title')}</title>
        <meta name="description" content={t('summit.subtitle')} />
      </Head>

      <StyledContainer maxWidth="lg" sx={{pt:15}}>
        <HeroSection >
          <Container>
            <Box sx={{ textAlign: 'center', mb: 5  }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {t('summit.title')}
              </Typography>
              <Typography variant="h6">
                {t('summit.subtitle')}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Typography variant="body1">
                  <strong>{t('summit.date')}</strong>
                </Typography>
                <Typography variant="body1">|</Typography>
                <Typography variant="body1">
                  <strong>{t('summit.location')}</strong>
                </Typography>
              </Box>
            </Box>
          </Container>
        </HeroSection>

        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <IntroCard>
              <CardMedia
                component="img"
                height="300"
                image={config.summitImage}
                alt={t('summit.title')}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: isRtl ? 'left' : 'left' }}>
                  {t('summit.title')}
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    textAlign: isRtl ? 'left' : 'left',
                    direction: isRtl ? 'rtl' : 'ltr'
                  }}
                >
                  {t('summit.introduction')}
                </Typography>
              </CardContent>
            </IntroCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormContainer>
              <Typography variant="h5" component="h2" gutterBottom>
                {t('summit.registerTitle')}
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {t('summit.formSuccess')}
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {t('summit.formError')}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label={t('summit.formName')}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      dir={isRtl ? 'left' : 'left'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label={t('summit.formEmail')}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      dir={isRtl ? 'left' : 'ltr'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('summit.formOrganization')}
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('summit.formPosition')}
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('summit.formPhone')}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label={t('summit.formMessage')}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{ py: 1.5 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        t('summit.formSubmit')
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormContainer>
          </Grid>
        </Grid>
      </StyledContainer>
    </>
  );
};

// Add the getLayout function to use the MainLayout
SummitPage.getLayout = (page) => (
  <MainLayout 
    seo={{
      title: 'Governance and Sustainable Development Summit',
      description: 'Join us for the Arab Governance and Sustainable Development Summit'
    }}
  >
    {page}
  </MainLayout>
);

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default SummitPage;
