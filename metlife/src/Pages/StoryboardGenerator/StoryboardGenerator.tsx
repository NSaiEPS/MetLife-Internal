import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './StoryboardGenerator.module.css';
import ButtonComp from '../../components/common/Buton/Button';
import WestIcon from '@mui/icons-material/West';
const StoryboardGenerator = () => {
  const [scriptTitle] = useState('Role of Vocabularies in Enterprise Architecture');

  const scenes = [
    {
      id: 1,
      title: 'Discovery of Confusion',
      description: 'A boardroom with a diverse group of professionals. A frustrated CTO sees multiple definitions of "customer" on a screen.',
      icon: '👔'
    },
    {
      id: 2,
      title: 'Conversation with the CTO',
      description: 'The CTO sits at his desk, appearing thoughtful. Another executive is speaking to him from across the desk.',
      icon: '💼'
    },
    {
      id: 3,
      title: 'Inconsistent Meanings',
      description: 'Floating terms like "client", "buyer", and "consumer" interlink in a tangled web, representing inconsistency.',
      icon: '🔀'
    },
    {
      id: 4,
      title: 'Unified Vocabulary Solution',
      description: 'The same CTO presents a centralized glossary showing "customer" with a clear, controlled definition.',
      icon: '✅'
    }
  ];

  const sidebarSteps = [
    { id: 1, title: 'Discovery of Confusion', description: 'A boardroom with a diverse group of professionals. A frustrated CTO sees multiple definitions of "customer" on a screen.' },
    { id: 2, title: 'Conversation with the CTO', description: 'The CTO sits at his desk, appearing thoughtful. Another executive is speaking to him from across the desk.' },
    { id: 3, title: 'Inconsistent Meanings', description: 'Floating terms like "client", "buyer", and "consumer" interlink in a tangled web, representing inconsistency.' },
    { id: 4, title: 'Unified Vocabulary Solution', description: 'The same CTO presents a centralized glossary showing "customer" with a clear, controlled definition.' }
  ];

  return (
    <Box className={styles.container}>
      <Box component="header" className={styles.headerSection}>
        <Box className={styles.titleArea}>
          <Typography variant="h4" component="h1">
            AI Storyboard Generator <span className={styles.newBadge}>New</span>
          </Typography>
          <Typography variant="body2">
            Turn your script into detailed storyboards for video creation
          </Typography>
        </Box>
        <Box className={styles.topActions}>
          <ButtonComp colorType="secondary" transform="none" small>
            <WestIcon sx={{ fontSize: 16 }} /> &nbsp; Back to Script
          </ButtonComp>
          <ButtonComp colorType="primary" transform="none" small >
            Continue to Audio →
          </ButtonComp>
        </Box>
      </Box>

      <Paper className={styles.scriptBanner} elevation={0}>
        <Box className={styles.scriptInfo}>
          <Box className={styles.scriptIcon}>1</Box>
          <Typography variant="body2">
            Script for <span className={styles.scriptTitle}>"{scriptTitle}"</span>
          </Typography>
        </Box>
        <ButtonComp
          colorType="primary"
          transform="none"
          small
          icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
          sx={{ background: 'var(--gold) !important', color: '#000 !important' }}
        >
          AI Generate Storyboard
        </ButtonComp>
      </Paper>

      <Box className={styles.descriptionBox}>
        A new CTO found three different meanings for "customer" during a merger, causing confusion.
        He realized inconsistent vocabularies create inefficiencies. This solution defined vocabularies for unifying communication.
      </Box>

      <Box className={styles.mainLayout}>
        <Box className={styles.storyboardGrid}>
          {scenes.map((scene) => (
            <Paper key={scene.id} className={styles.sceneCard} elevation={0}>
              <Box className={styles.sceneHeader}>
                <Typography variant="caption">Scene {scene.id}</Typography>
                <IconButton size="small" sx={{ color: 'var(--text-muted-dark)' }}>
                  <AddIcon fontSize="inherit" />
                </IconButton>
              </Box>
              <Box className={styles.imagePlaceholder}>
                <Box className={styles.imageBox}>{scene.icon}</Box>
              </Box>
              <Box className={styles.sceneBody}>
                <Typography variant="subtitle1" className={styles.sceneTitle}>
                  {scene.title}
                </Typography>
                <Typography variant="body2" className={styles.sceneDescription}>
                  {scene.description}
                </Typography>
              </Box>
              <Box className={styles.sceneActions}>
                <ButtonComp colorType="outlined" transform="none" small icon={<ReplayIcon sx={{ fontSize: 14 }} />} sx={{ py: 0.5, px: 1, fontSize: 11 }}>
                  Regenerate
                </ButtonComp>
                <ButtonComp colorType="outlined" transform="none" small icon={<EditIcon sx={{ fontSize: 14 }} />} sx={{ py: 0.5, px: 1, fontSize: 11 }}>
                  Edit Scene
                </ButtonComp>
              </Box>
            </Paper>
          ))}
        </Box>

        <Paper className={styles.sidebarCard} elevation={0}>
          <Typography variant="h6" className={styles.sidebarTitle}>
            <AutoAwesomeIcon sx={{ fontSize: 18 }} /> AI Generate Storyboard &gt;
          </Typography>
          <Box className={styles.sidebarList}>
            {sidebarSteps.map((step) => (
              <Box key={step.id} className={styles.sidebarItem}>
                <Typography variant="subtitle2">
                  {step.id}. {step.title}
                </Typography>
                <Typography variant="body2">
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      <Box className={styles.bottomActions}>
        <Box className={styles.leftBottom}>
          <ButtonComp colorType="secondary" transform="none" small icon={<AddIcon sx={{ fontSize: 18 }} />}>
            Add Scene
          </ButtonComp>
          <ButtonComp colorType="secondary" transform="none" small icon={<ArrowBackIcon sx={{ fontSize: 18 }} />}>
            Back
          </ButtonComp>
        </Box>
        <Box className={styles.rightBottom}>
          <ButtonComp colorType="secondary" transform="none" icon={<ReplayIcon sx={{ fontSize: 18, mr: 1 }} />}>
            Regenerate Storyboard
          </ButtonComp>
          <ButtonComp
            colorType="primary"
            transform="none"
            icon={<SaveIcon sx={{ fontSize: 18, mr: 1 }} />}
            sx={{ background: 'var(--gold) !important', color: '#000 !important' }}
          >
            Save Storyboard
          </ButtonComp>
        </Box>
      </Box>

      <Box className={styles.utilityCards}>
        <Paper className={styles.utilityCard} elevation={0}>
          <Box className={styles.utilityIcon}>📝</Box>
          <Box className={styles.utilityText}>
            <Typography variant="subtitle2">AI Improve Script</Typography>
            <Typography variant="caption">Powerful example-themed screenwriter</Typography>
          </Box>
        </Paper>
        <Paper className={styles.utilityCard} elevation={0}>
          <Box className={styles.utilityIcon}>🤖</Box>
          <Box className={styles.utilityText}>
            <Typography variant="subtitle2">AI Video Assistant</Typography>
            <Typography variant="caption">Ask AI for help on your storyboard</Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default StoryboardGenerator;
