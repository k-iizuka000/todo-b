import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { GitHub, Twitter, LinkedIn } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Information */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              PromptHub
            </Typography>
            <Typography variant="body2">
              {t('footer.description', {
                defaultValue: 'Share and discover AI prompts with the community.'
              })}
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer.quickLinks')}
            </Typography>
            <Box>
              <Link href="/about" color="inherit" sx={{ display: 'block', mb: 1 }}>
                {t('footer.about')}
              </Link>
              <Link href="/terms" color="inherit" sx={{ display: 'block', mb: 1 }}>
                {t('footer.terms')}
              </Link>
              <Link href="/privacy" color="inherit" sx={{ display: 'block', mb: 1 }}>
                {t('footer.privacy')}
              </Link>
              <Link href="/contact" color="inherit" sx={{ display: 'block' }}>
                {t('footer.contact')}
              </Link>
            </Box>
          </Grid>

          {/* Social Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer.followUs')}
            </Typography>
            <Box>
              <IconButton
                color="inherit"
                href="https://github.com/prompthub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GitHub />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://twitter.com/prompthub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://linkedin.com/company/prompthub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2">
            © {currentYear} PromptHub. {t('footer.allRightsReserved')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;