import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
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
  Colorize as ColorizeIcon,
} from '@mui/icons-material';
import { useNavigate, useBlocker } from 'react-router-dom';
import styles from './BrandKit.module.css';
import ButtonComp from '../../components/common/Buton/Button';

const BrandKit = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('brand-kit');
  const [fontSize, setFontSize] = useState(16);
  const [headingFont, setHeadingFont] = useState('Syne');
  const [bodyFont, setBodyFont] = useState('DM Sans');
  const [fontPickerOpen, setFontPickerOpen] = useState(false);
  const [pickingType, setPickingType] = useState<'heading' | 'body'>('heading');
  const [selectedStyle, setSelectedStyle] = useState('Enterprise Atlas');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Standard way to show the browser confirm dialog
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const [colors, setColors] = useState([
    { hex: '#162A46', name: 'Primary', color: '#162A46' },
    { hex: '#F5A623', name: 'Accent', color: '#F5A623' },
    { hex: '#FFFFFF', name: 'White', color: '#FFFFFF' },
    { hex: '#1e6fd9', name: 'Secondary', color: '#1e6fd9' },
    { hex: '#4B5563', name: 'Neutral', color: '#4B5563' },
  ]);

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoFile(null);
    setIsDirty(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRandomizePalette = () => {
    setColors(colors.map((c: any) => {
      if (c.name === 'White') return c; // Always keep white
      if (c.name === 'Neutral') {
        const lightColor = '#' + Math.floor(Math.random() * 55 + 200).toString(16).repeat(3).slice(0, 7); // Light greyish
        return { ...c, hex: lightColor, color: lightColor };
      }
      const randomColor = generateRandomColor();
      return { ...c, hex: randomColor, color: randomColor };
    }));
    setIsDirty(true);
  };

  const updateColor = (index: number, newHex: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], hex: newHex.toUpperCase(), color: newHex.toUpperCase() };
    setColors(newColors);
    setIsDirty(true);
  };

  const saveChanges = () => {
    // Collect all brand kit data and prepare as FormData
    const formData = new FormData();

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    // Convert color hex array to JSON string for FormData (standard practice)
    const colorArray = colors.map((c: any) => c.hex);
    formData.append('colorPalette', JSON.stringify(colorArray));

    formData.append('typography', JSON.stringify({
      fontSize: fontSize,
      headingFont: 'Syne Bold',
      bodyFont: 'DM Sans Regular'
    }));

    formData.append('videoStyle', selectedStyle);

    // Demonstration: Log the FormData entries (FormData is not easily printable, so we loop)
    console.log('Sending Brand Kit Data as FormData:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Logic to save brand kit changes would go here
    setIsDirty(false);
    setSaveSuccess(true);
  };

  const FONT_OPTIONS = [
    { name: 'Syne', family: 'Syne, sans-serif' },
    { name: 'DM Sans', family: '"DM Sans", sans-serif' },
    { name: 'Poppins', family: 'Poppins, sans-serif' },
    { name: 'Inter', family: 'Inter, sans-serif' },
    { name: 'Playfair Display', family: '"Playfair Display", serif' },
    { name: 'Lora', family: 'Lora, serif' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif' },
  ];

  const handleOpenFontPicker = (type: 'heading' | 'body') => {
    setPickingType(type);
    setFontPickerOpen(true);
  };

  const selectFont = (fontFamily: string) => {
    if (pickingType === 'heading') {
      setHeadingFont(fontFamily);
    } else {
      setBodyFont(fontFamily);
    }
    setFontPickerOpen(false);
    setIsDirty(true);
  };

  const tabs = [
    { id: 'brand-kit', label: 'Brand Kit', icon: <BrandKitIcon fontSize="small" /> },
    { id: 'logo', label: 'Logo', icon: <LogoIcon fontSize="small" /> },
    { id: 'color-palette', label: 'Color Palette', icon: <PaletteIcon fontSize="small" /> },
    { id: 'typography', label: 'Typography', icon: <TypographyIcon fontSize="small" /> },
    { id: 'video-styles', label: 'Video Styles', icon: <VideoStylesIcon fontSize="small" /> },
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
              <Box sx={{ display: 'flex', gap: 1 }}>
                <button
                  className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`}
                  onClick={triggerUpload}
                >
                  <UploadIcon sx={{ fontSize: 16 }} /> {logo ? 'Change' : 'Upload Logo'}
                </button>
                {logo && (
                  <button
                    className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`}
                    onClick={removeLogo}
                  >
                    <RemoveIcon sx={{ fontSize: 16 }} /> Remove
                  </button>
                )}
              </Box>
            </Box>
            <Box className={styles.logoUploadBox} sx={{ py: 3, cursor: 'pointer' }} onClick={triggerUpload}>
              {logo ? (
                <img src={logo} alt="Brand Logo" style={{ maxHeight: '60px', maxWidth: '100%' }} />
              ) : (
                <Typography className={styles.uploadDesc}>
                  EdWave (click to upload your logo)
                </Typography>
              )}
            </Box>
          </Box>

          {/* Color Palette Section */}
          <Box className={styles.card} sx={{ mb: 2 }}>
            <Box className={styles.cardHeader}>
              <Typography className={styles.cardTitle}>Color Palette</Typography>
              <button
                className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`}
                onClick={handleRandomizePalette}
              >
                <BrandKitIcon sx={{ fontSize: 14, mr: 0.5 }} /> Random Palette
              </button>
            </Box>
            <Box className={styles.colorPaletteGrid} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: '8px' }}>
                {colors.map((c, i) => (
                  <Box
                    key={c.name}
                    onClick={() => {
                      setSelectedColorIndex(i);
                      setIsDirty(true);
                    }}
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
                      transition: 'all 0.3s ease',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: (c.hex === '#FFFFFF' || c.hex === 'white' || c.hex.toLowerCase() === '#ffffff') ? '#000' : '#fff',
                      position: 'relative',
                      '& svg': {
                        fontSize: '14px',
                        opacity: selectedColorIndex === i ? 0.7 : 0,
                        transition: 'opacity 0.2s ease'
                      },
                      '&:hover svg': {
                        opacity: 1
                      }
                    }}
                  >
                    {selectedColorIndex === i ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ColorizeIcon sx={{ fontSize: '12px' }} />
                        {c.hex}
                      </Box>
                    ) : (
                      <ColorizeIcon />
                    )}
                    <input
                      type="color"
                      value={c.hex}
                      onChange={(e) => updateColor(i, e.target.value)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            <button
              className={`${styles.primaryBtn} ${styles.btnSm}`}
              style={{ background: '#f5a623', padding: '4px 12px' }}
              onClick={() => setActiveTab('color-palette')}
            >
              <EditIcon sx={{ fontSize: 14 }} /> Edit Palette
            </button>
          </Box>

          {/* Typography Section */}
          <Box className={styles.card} sx={{ mb: 2 }}>
            <Typography className={styles.cardTitle}>Typography</Typography>
            <Typography variant="caption" sx={{ color: '#4b5563', mb: 1, display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Primary Font</Typography>
            <Box className={styles.typographyBox} sx={{ py: 2, px: 3 }}>
              <Typography sx={{ fontSize: `${fontSize * 1.5}px`, fontWeight: 700, mb: 0.5, fontFamily: headingFont }}>Heading — {headingFont}</Typography>
              <Typography sx={{ fontSize: `${fontSize}px`, color: '#8899bb', fontFamily: bodyFont }}>Body text — {bodyFont} for video subtitles and captions</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              <button
                className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`}
                onClick={() => handleOpenFontPicker('heading')}
              >
                Change Heading
              </button>
              <button
                className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`}
                onClick={() => handleOpenFontPicker('body')}
              >
                Change Body
              </button>
            </Box>
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
              <Box className={styles.logoUploadBox} onClick={triggerUpload} sx={{ cursor: 'pointer' }}>
                {logo ? (
                  <img src={logo} alt="Brand Logo" style={{ maxHeight: '120px', maxWidth: '100%' }} />
                ) : (
                  <>
                    <UploadIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.4)' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>Drop logo here or click to upload</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>Supports PNG, SVG, WebP (max 5MB)</Typography>
                    </Box>
                  </>
                )}
              </Box>
              <Box className={styles.logoActions}>
                <button className={`${styles.primaryBtn} ${styles.btnSm}`} onClick={triggerUpload}>
                  <UploadIcon sx={{ fontSize: 16 }} /> {logo ? 'Change Logo' : 'Upload Logo'}
                </button>
                {logo && (
                  <button className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`} onClick={removeLogo}>
                    <RemoveIcon sx={{ fontSize: 16 }} /> Remove
                  </button>
                )}
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
              <Box className={styles.cardHeader} sx={{ mb: 2 }}>
                <Typography className={styles.cardTitle} sx={{ mb: 0 }}>Color Palette</Typography>
                <button
                  className={`${styles.secondaryBtn} ${styles.btnSm}`}
                  onClick={handleRandomizePalette}
                >
                  <BrandKitIcon sx={{ fontSize: 16, mr: 0.5 }} /> Random Palette
                </button>
              </Box>
              <Box className={styles.colorPaletteGrid}>
                {colors.map((c, i) => (
                  <Box key={c.name} className={styles.colorSwatch} sx={{ position: 'relative' }}>
                    <Box
                      className={styles.colorBox}
                      sx={{
                        bgcolor: c.color,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: (c.hex === '#FFFFFF' || c.hex === 'white' || c.hex.toLowerCase() === '#ffffff') ? '#000' : '#fff',
                        '& svg': {
                          opacity: 0.5,
                          transition: 'all 0.2s ease',
                          fontSize: '1.2rem'
                        },
                        '&:hover svg': {
                          opacity: 1,
                          transform: 'scale(1.2) rotate(-10deg)'
                        }
                      }}
                    >
                      <PaletteIcon />
                    </Box>
                    <Typography className={styles.colorLabel}>{c.name} ({c.hex})</Typography>
                    <input
                      type="color"
                      value={c.hex}
                      onChange={(e) => updateColor(i, e.target.value)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '80px', // Matches .colorBox height
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </Box>
                ))}
              </Box>
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
                <Typography className={styles.headingPreview} style={{ fontSize: `${fontSize * 1.5}px`, fontFamily: headingFont }}>Heading — {headingFont}</Typography>
                <Typography className={styles.bodyPreview} style={{ fontSize: `${fontSize}px`, fontFamily: bodyFont }}>Body text — {bodyFont} for video subtitles and captions</Typography>
              </Box>

              <Box className={styles.sliderContainer}>
                <Typography className={styles.sliderLabel}>Subtitle Font Size: {fontSize}px</Typography>
                <Slider
                  value={fontSize}
                  onChange={(_, newValue) => {
                    setFontSize(newValue as number);
                    setIsDirty(true);
                  }}
                  step={1}
                  min={12}
                  max={32}
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

              <Box sx={{ display: 'flex', gap: 2 }}>
                <button
                  className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`}
                  onClick={() => handleOpenFontPicker('heading')}
                >
                  Browse Heading Fonts
                </button>
                <button
                  className={`${styles.secondaryBtn} ${styles.btnSm} ${styles.btnOutline}`}
                  onClick={() => handleOpenFontPicker('body')}
                >
                  Browse Body Fonts
                </button>
              </Box>
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
                    onClick={() => {
                      setSelectedStyle(s.name);
                      setIsDirty(true);
                    }}
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
            <button className={styles.primaryBtn} onClick={saveChanges}>
              {isDirty ? 'Save Changes' : 'Saved'}
            </button>
            <button className={styles.secondaryBtn}>Manage Templates</button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Brand kit updated successfully!
        </Alert>
      </Snackbar>

      {/* Navigation Blocker Dialog */}
      <Dialog
        open={blocker.state === 'blocked'}
        onClose={() => blocker.reset && blocker.reset()}
        PaperProps={{
          sx: {
            bgcolor: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#8899bb' }}>
            You have unsaved changes in your Brand Kit. Are you sure you want to leave without saving?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => blocker.reset && blocker.reset()}
            sx={{ color: '#fff', textTransform: 'none' }}
          >
            Stay
          </Button>
          <Button
            onClick={() => blocker.proceed && blocker.proceed()}
            variant="contained"
            sx={{
              bgcolor: '#ef4444',
              '&:hover': { bgcolor: '#dc2626' },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={fontPickerOpen}
        onClose={() => setFontPickerOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '320px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Select {pickingType === 'heading' ? 'Heading' : 'Body'} Font</DialogTitle>
        <DialogContent sx={{ p: '0 !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {FONT_OPTIONS.map((f) => (
              <Box
                key={f.name}
                onClick={() => selectFont(f.name)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  '&:last-of-type': { borderBottom: 'none' },
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: (pickingType === 'heading' ? headingFont : bodyFont) === f.name ? 'rgba(245, 166, 35, 0.1)' : 'transparent',
                }}
              >
                <Typography sx={{ fontFamily: f.family, fontSize: '1.1rem' }}>{f.name}</Typography>
                {(pickingType === 'heading' ? headingFont : bodyFont) === f.name && (
                  <Typography variant="caption" sx={{ color: '#f5a623', fontWeight: 700 }}>SELECTED</Typography>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFontPickerOpen(false)} sx={{ color: '#8899bb' }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleLogoUpload}
      />
    </Box>
  );
};

export default BrandKit;
