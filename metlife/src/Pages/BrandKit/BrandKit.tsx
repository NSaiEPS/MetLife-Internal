import { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
} from '@mui/material';
import {
  EmojiEvents as BrandKitIcon,
  Image as LogoIcon,
  Palette as PaletteIcon,
  TextFields as TypographyIcon,
  Movie as VideoStylesIcon,
  CloudUpload as UploadIcon,
  NavigateNext as NextIcon,
  DeleteOutline as RemoveIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  MovieCreation as SceneIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import styles from './BrandKit.module.css';
import ButtonComp from '../../components/common/Buton/Button';

const BrandKit = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('brand-kit');
  const [fontSize, setFontSize] = useState(50);
  const [selectedStyle, setSelectedStyle] = useState('Enterprise Atlas');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const tabs = [
    { id: 'brand-kit', label: 'Brand Kit', icon: <BrandKitIcon fontSize="small" /> },
    { id: 'logo', label: 'Logo', icon: <LogoIcon fontSize="small" /> },
    { id: 'color-palette', label: 'Color Palette', icon: <PaletteIcon fontSize="small" /> },
    { id: 'typography', label: 'Typography', icon: <TypographyIcon fontSize="small" /> },
    { id: 'video-styles', label: 'Video Styles', icon: <VideoStylesIcon fontSize="small" /> },
  ];

  const colors = [
    { hex: '#162A46', name: 'Primary', color: '#162A46' },
    { hex: '#F5A623', name: 'Accent', color: '#F5A623' },
    { hex: '#FFFFFF', name: 'White', color: '#FFFFFF' },
    { hex: '#2563EB', name: 'Secondary', color: '#2563EB' },
    { hex: '#4B5563', name: 'Neutral', color: '#4B5563' },
  ];

  const stylesList = [
    { name: 'Enterprise Atlas', id: 'enterprise', isDefault: true },
    { name: 'Team Preview', id: 'team' },
    { name: 'Corporate Clean', id: 'corporate' },
    { name: 'Minimal Dark', id: 'minimal' },
  ];

  const renderSection = () => {
    if (activeTab === 'brand-kit') {
      return (
        <Box className={styles.sectionContent}>
          <Box className={styles.sectionHeader}>
            <Typography variant="body2" className={styles.sectionSubtitle}>
              Establish brand guidelines applied across all videos
            </Typography>
          </Box>

          {/* Logo Section */}
          <Box className={styles.card} sx={{ mb: 2 }}>
            <Box className={styles.cardHeader}>
              <Typography className={styles.cardTitle} sx={{ mb: 0 }}>Logo</Typography>
              <button className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`}>
                <UploadIcon sx={{ fontSize: 16 }} /> Upload Logo
              </button>
            </Box>
            <Box className={styles.logoUploadBox} sx={{ py: 3 }}>
              <Typography className={styles.uploadDesc}>
                EdWave (click to upload your logo)
              </Typography>
            </Box>
          </Box>

          {/* Color Palette Section */}
          <Box className={styles.card} sx={{ mb: 2 }}>
            <Typography className={styles.cardTitle}>Color Palette</Typography>
            <Box className={styles.colorPaletteGrid} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: '8px' }}>
                {colors.map((c, i) => (
                  <Box
                    key={c.hex}
                    onClick={() => setSelectedColorIndex(i)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: selectedColorIndex === i ? '100px' : '40px',
                      height: '40px',
                      borderRadius: '4px',
                      bgcolor: c.color,
                      border: '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      transition: 'width 0.3s ease',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: i === 2 ? '#000' : '#fff' // White color needs black text
                    }}
                  >
                    {selectedColorIndex === i && c.hex}
                  </Box>
                ))}
              </Box>
            </Box>
            <button className={`${styles.primaryBtn} ${styles.btnSm}`} style={{ background: '#f5a623', padding: '4px 12px' }}>
              <EditIcon sx={{ fontSize: 14 }} /> Edit Palette
            </button>
          </Box>

          {/* Typography Section */}
          <Box className={styles.card} sx={{ mb: 2 }}>
            <Typography className={styles.cardTitle}>Typography</Typography>
            <Typography variant="caption" sx={{ color: '#4b5563', mb: 1, display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Primary Font</Typography>
            <Box className={styles.typographyBox} sx={{ py: 2, px: 3 }}>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 700 }}>Heading Style</Typography>
              <Typography variant="caption" sx={{ color: '#8899bb' }}>Body text example for video subtitles and captions</Typography>
            </Box>
            <button className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`} style={{ marginTop: '12px' }}>
              Change Font
            </button>
          </Box>

          {/* Video Styles Section */}
          <Box className={styles.card} sx={{ mb: 10 }}>
            <Typography className={styles.cardTitle}>Video Styles</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {stylesList.slice(0, 2).map(s => (
                <Box key={s.id} className={`${styles.videoStyleCard} ${selectedStyle === s.name ? styles.videoStyleSelected : ''}`} sx={{ flex: 1, height: '80px', maxWidth: '240px' }}>
                  <Box className={styles.cardTop}>{s.name}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      );
    }

    switch (activeTab) {
      case 'logo':
        return (
          <Box className={styles.sectionContent}>
            <Box className={styles.sectionHeader}>
              <Typography variant="body2" className={styles.sectionSubtitle}>
                Establish brand guidelines applied across all videos
              </Typography>
            </Box>
            <Box className={styles.card}>
              <Typography className={styles.cardTitle}>Logo Upload</Typography>
              <Box className={styles.logoUploadBox}>
                <UploadIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.4)' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>Drop logo here or click to upload</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>Supports PNG, SVG, WebP (max 5MB)</Typography>
                </Box>
              </Box>
              <Box className={styles.logoActions}>
                <button className={`${styles.primaryBtn} ${styles.btnSm}`}>
                  <UploadIcon sx={{ fontSize: 16 }} /> Upload Logo
                </button>
                <button className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`}>
                  <RemoveIcon sx={{ fontSize: 16 }} /> Remove
                </button>
              </Box>
            </Box>
          </Box>
        );
      case 'color-palette':
        return (
          <Box className={styles.sectionContent}>
            <Box className={styles.sectionHeader}>
              <Typography variant="body2" className={styles.sectionSubtitle}>
                Establish brand guidelines applied across all videos
              </Typography>
            </Box>
            <Box className={styles.card}>
              <Typography className={styles.cardTitle}>Color Palette</Typography>
              <Box className={styles.colorPaletteGrid}>
                {colors.map((c) => (
                  <Box key={c.hex} className={styles.colorSwatch}>
                    <Box className={styles.colorBox} sx={{ bgcolor: c.color }} />
                    <Typography className={styles.colorLabel}>{c.name}</Typography>
                  </Box>
                ))}
              </Box>
              <button className={`${styles.primaryBtn} ${styles.btnSm}`}>
                <EditIcon sx={{ fontSize: 16 }} /> Edit Palette
              </button>
            </Box>
          </Box>
        );
      case 'typography':
        return (
          <Box className={styles.sectionContent}>
            <Box className={styles.sectionHeader}>
              <Typography variant="body2" className={styles.sectionSubtitle}>
                Establish brand guidelines applied across all videos
              </Typography>
            </Box>
            <Box className={styles.card}>
              <Typography className={styles.cardTitle}>Typography</Typography>
              <Typography variant="caption" sx={{ color: '#4b5563', mb: 1, display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Primary Font</Typography>
              <Box className={styles.typographyBox}>
                <Typography className={styles.headingPreview} style={{ fontSize: `${fontSize * 0.4 + 16}px` }}>Heading — Syne Bold</Typography>
                <Typography className={styles.bodyPreview} style={{ fontSize: `${fontSize * 0.2 + 12}px` }}>Body text — DM Sans Regular for video subtitles and captions</Typography>
              </Box>

              <Box className={styles.sliderContainer}>
                <Typography className={styles.sliderLabel}>Subtitle Font Size</Typography>
                <Slider
                  value={fontSize}
                  onChange={(_, newValue) => setFontSize(newValue as number)}
                  step={10}
                  min={0}
                  max={100}
                  sx={{
                    color: '#f5a623',
                    height: 2,
                    padding: '13px 0',
                    '& .MuiSlider-thumb': {
                      height: 14,
                      width: 14,
                      backgroundColor: '#f5a623',
                      boxShadow: '0 0 10px rgba(245, 166, 35, 0.5)',
                      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                        boxShadow: '0 0 15px rgba(245, 166, 35, 0.8)',
                      },
                      '&:before': {
                        display: 'none',
                      },
                    },
                    '& .MuiSlider-track': {
                      display: 'none',
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.1,
                      backgroundColor: '#fff',
                    },
                  }}
                />
              </Box>

              <button className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`}>
                Browse Fonts
              </button>
            </Box>
          </Box>
        );
      case 'video-styles':
        return (
          <Box className={styles.sectionContent}>
            <Box className={styles.sectionHeader}>
              <Typography variant="body2" className={styles.sectionSubtitle}>
                Establish brand guidelines applied across all videos
              </Typography>
            </Box>
            <Box className={styles.card}>
              <Typography className={styles.cardTitle}>Video Styles</Typography>
              <Box className={styles.videoStylesGrid}>
                {stylesList.map((s) => (
                  <Box
                    key={s.id}
                    className={`${styles.videoStyleCard} ${selectedStyle === s.name ? styles.videoStyleSelected : ''}`}
                    onClick={() => setSelectedStyle(s.name)}
                  >
                    <Box className={styles.cardTop}>
                      {s.name}
                    </Box>
                    <Box className={styles.cardBottom}>
                      {selectedStyle === s.name ? 'Selected ✓' : 'Click to select'}
                      {s.isDefault && <Typography variant="caption" sx={{ fontWeight: 700 }}>Default</Typography>}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box className={styles.container}>
      {/* Header */}
      <Box component="header" className={styles.header}>
        <Box className={styles.headerTitle} onClick={() => setActiveTab('brand-kit')} sx={{ cursor: 'pointer' }}>
          <Box sx={{ color: '#f5a623', display: 'flex' }}>
            <BrandKitIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Brand Kit</Typography>
        </Box>
        <Box className={styles.headerActions}>
          <ButtonComp
            colorType="secondary"
            transform="none"
            small
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </ButtonComp>
          <ButtonComp
            colorType="primary"
            transform="none"
            small
            sx={{ bgcolor: '#f5a623 !important', color: '#000 !important' }}
          >
            Templates <NextIcon sx={{ fontSize: 16, ml: 0.5 }} />
          </ButtonComp>
        </Box>
      </Box>

      <Box className={styles.mainLayout}>
        {/* Sidebar */}
        <Box component="nav" className={styles.sidebar}>
          {tabs.map((tab) => (
            <Box
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i>{tab.icon}</i>
              <span>{tab.label}</span>
            </Box>
          ))}
        </Box>

        {/* Content Area */}
        <Box className={styles.contentArea}>
          {renderSection()}
        </Box>

        {/* Right Preview Panel */}
        <Box component="aside" className={styles.rightPanel}>
          <Box>
            <Typography className={styles.previewLabel}>Preview</Typography>
            <Box className={styles.previewWindow}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#f5a623' }}>Edw<span>Surf</span></Typography>
                <Typography variant="caption" sx={{ color: '#8899bb', letterSpacing: '0.1em' }}>Content Studio</Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.sceneButtons}>
            <Box className={styles.sceneItem}>
              <Box className={styles.sceneTitleWrap}>
                <SceneIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                <span>Intro Scene</span>
              </Box>
              <Box className={styles.sceneEdit}>
                <EditIcon sx={{ fontSize: 10 }} /> EDIT
              </Box>
            </Box>
            <Box className={styles.sceneItem}>
              <Box className={styles.sceneTitleWrap}>
                <FlagIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                <span>Outro Scene</span>
              </Box>
              <Box className={styles.sceneEdit}>
                <EditIcon sx={{ fontSize: 10 }} /> EDIT
              </Box>
            </Box>
          </Box>

          <Box className={styles.rightActions}>
            <button className={styles.primaryBtn}>Save Changes</button>
            <button className={styles.secondaryBtn}>Manage Templates</button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BrandKit;
