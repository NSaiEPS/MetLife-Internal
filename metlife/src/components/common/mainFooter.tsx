
import { Box, Typography, Link, IconButton, Container, Divider, Grid } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import styles from "./mainFooter.module.css";
import footerLogo from "../../assets/edwsurf_dark_logo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={6} className={styles.footerGrid}>

          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 4 }} className={styles.brandSection}>
            <div className={styles.logoWrapper}>
              {/* <img src={footerLogo} alt="EdWave Logo" className={styles.logo} /> */}
              <Typography variant="h6" className={styles.brandName}>
                EdWave
              </Typography>
            </div>

            <Typography variant="body2" className={styles.description}>
              Empowering creators to build high-quality educational videos with AI-powered script generation and localization.
            </Typography>

            <Box className={styles.socialLinks}>
              <IconButton aria-label="LinkedIn" className={styles.socialIcon}>
                <LinkedInIcon />
              </IconButton>
              <IconButton aria-label="Twitter" className={styles.socialIcon}>
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="GitHub" className={styles.socialIcon}>
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Product */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" className={styles.columnTitle}>
              Product
            </Typography>
            <Box className={styles.linkList}>
              <Link href="#" className={styles.footLink}>Features</Link>
              <Link href="#" className={styles.footLink}>Templates</Link>
              <Link href="#" className={styles.footLink}>Localization</Link>
              <Link href="#" className={styles.footLink}>AI Presenter</Link>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" className={styles.columnTitle}>
              Resources
            </Typography>
            <Box className={styles.linkList}>
              <Link href="#" className={styles.footLink}>Documentation</Link>
              <Link href="#" className={styles.footLink}>Help Center</Link>
              <Link href="#" className={styles.footLink}>API Reference</Link>
              <Link href="#" className={styles.footLink}>Community</Link>
            </Box>
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" className={styles.columnTitle}>
              Company
            </Typography>
            <Box className={styles.linkList}>
              <Link href="#" className={styles.footLink}>About Us</Link>
              <Link href="#" className={styles.footLink}>Careers</Link>
              <Link href="#" className={styles.footLink}>Blog</Link>
              <Link href="#" className={styles.footLink}>Contact</Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" className={styles.columnTitle}>
              Legal
            </Typography>
            <Box className={styles.linkList}>
              <Link href="#" className={styles.footLink}>Privacy Policy</Link>
              <Link href="#" className={styles.footLink}>Terms of Service</Link>
              <Link href="#" className={styles.footLink}>Cookie Policy</Link>
              <Link href="#" className={styles.footLink}>Security</Link>
            </Box>
          </Grid>

        </Grid>

        <Divider className={styles.divider} />

        <Box className={styles.bottomBar}>
          <Typography variant="body2" className={styles.copyright}>
            © {currentYear} EdWave. Powered by SurfAI. All rights reserved.
          </Typography>

          <Box className={styles.bottomLinks}>
            <Link href="#" className={styles.bottomLink}>Status</Link>
            <Link href="#" className={styles.bottomLink}>Privacy</Link>
            <Link href="#" className={styles.bottomLink}>Terms</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;