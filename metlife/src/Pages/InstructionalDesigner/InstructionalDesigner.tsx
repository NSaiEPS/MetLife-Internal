import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Paper,
  IconButton
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import InfoIcon from '@mui/icons-material/Info';
import styles from './InstructionalDesigner.module.css';
import ButtonComp from '../../components/common/Buton/Button';

const InstructionalDesigner = () => {
  const [topic, setTopic] = useState('Role of Vocabularies in Enterprise Architecture');
  const [audience, setAudience] = useState('Software Architect');
  const [duration, setDuration] = useState('5 minutes');
  const [tone, setTone] = useState('Educational');

  const steps = [
    {
      id: 1,
      title: 'Problem Introduction',
      description: 'Start by highlighting issue caused by inconsistent vocabularies in enterprise architecture.'
    },
    {
      id: 2,
      title: 'Vocabulary Definitions',
      description: 'Define key terms like taxonomies, ontologies, and controlled vocabularies, explaining their roles.'
    },
    {
      id: 3,
      title: 'Enterprise Example',
      description: 'Show a case study: how standardized vocabularies improved a company\'s API integration.'
    },
    {
      id: 4,
      title: 'Implementation Steps',
      description: 'Outline practical steps teams can take to establish and maintain consistent vocabularies.'
    },
    {
      id: 5,
      title: 'Summary',
      description: 'Recap the importance of consistent terminologies and prompt the audience to review their own vocabularies.'
    }
  ];

  const objectives = [
    'Understand the importance of consistent vocabularies in enterprise.',
    'Learn how standardized terms enhance interoperability.',
    'Implement steps for maintaining controlled vocabularies.'
  ];

  return (
    <Box className={styles.container}>
      <Box component="header" className={styles.header}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          AI Instructional Designer
        </Typography>
        <Typography variant="body1" color="var(--text-secondary-dark)" sx={{ mb: 0.5 }}>
          (Auto-Pedagogy Engine)
        </Typography>
        <Typography variant="body2" className={styles.subtitle}>
          Let our AI structure the perfect lesson flow for your educational videos
        </Typography>
      </Box>

      <Paper className={styles.inputCard} elevation={0}>
        <Box className={styles.inputGrid}>
          <Box className={styles.inputGroup}>
            <Typography variant="caption" className={styles.label}>Topic</Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic..."
              className={styles.muiTextField}
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--gold) !important",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "var(--gold) !important",
                }
              }}
            />
          </Box>
          <Box className={styles.inputGroup}>
            <Typography variant="caption" className={styles.label}>Audience</Typography>
            <Select
              fullWidth
              size="small"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={styles.muiSelect}
              sx={{
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--gold) !important",
                }
              }}
            >
              <MenuItem value="Software Architect">Software Architect</MenuItem>
              <MenuItem value="Project Manager">Project Manager</MenuItem>
              <MenuItem value="Developer">Developer</MenuItem>
            </Select>
          </Box>
          <Box className={styles.inputGroup}>
            <Typography variant="caption" className={styles.label}>Duration</Typography>
            <Select
              fullWidth
              size="small"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={styles.muiSelect}
              sx={{
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--gold) !important",
                }
              }}
            >
              <MenuItem value="5 minutes">5 minutes</MenuItem>
              <MenuItem value="10 minutes">10 minutes</MenuItem>
              <MenuItem value="15 minutes">15 minutes</MenuItem>
            </Select>
          </Box>
          <Box className={styles.inputGroup}>
            <Typography variant="caption" className={styles.label}>Tone</Typography>
            <Select
              fullWidth
              size="small"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={styles.muiSelect}
              sx={{
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--gold) !important",
                }
              }}
            >
              <MenuItem value="Educational">Educational</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
            </Select>
          </Box>
        </Box>
        <ButtonComp transform='none' colorType="primary" sx={{ mt: 2, width: 'fit-content' }}>
          Generate Learning Structure
        </ButtonComp>
      </Paper>

      <Box className={styles.resultsSection}>
        <Paper className={styles.structureCard} elevation={0}>
          <Typography variant="h6" className={styles.structureTitle}>
            Suggested Learning Structure
            <IconButton size="small" sx={{ ml: 1, color: 'var(--text-secondary-dark)', opacity: 0.6 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Typography>

          <Stack spacing={3} className={styles.stepList}>
            {steps.map((step) => (
              <Box key={step.id} className={styles.stepItem}>
                <Box className={styles.stepNumber}>{step.id}</Box>
                <Box className={styles.stepContent}>
                  <Typography variant="subtitle1" component="h3" fontWeight={600} color="var(--blue-accent)">
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="var(--text-secondary-dark)">
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          <Box className={styles.refinementBox}>
            <Typography variant="subtitle2" className={styles.refinementTitle}>
              <LightbulbIcon sx={{ fontSize: 18, mr: 1 }} /> Refinement Suggestions
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, mt: 1 }}>
              <Typography component="li" variant="caption" className={styles.refinementListItem}>
                Visualize Scene 2 with an ontology diagram explaining term hierarchies.
              </Typography>
              <Typography component="li" variant="caption" className={styles.refinementListItem}>
                Include a brief quiz in Scene 5 to reinforce key terms discussed.
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper className={styles.objectivesCard} elevation={0}>
          <Typography variant="h6" className={styles.objectivesTitle}>
            Learning Objectives
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2, mb: 3 }}>
            {objectives.map((obj, index) => (
              <Box key={index} className={styles.objectiveItem}>
                <Typography variant="body2" color="var(--green)" fontWeight={700} sx={{ mr: 1 }}>
                  ✓
                </Typography>
                <Typography variant="body2" color="var(--text-secondary-dark)">
                  {obj}
                </Typography>
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            <ButtonComp transform='none' colorType="outlined" fullWidth>
              Generate Outline
            </ButtonComp>
            <ButtonComp transform='none' colorType="primary" fullWidth sx={{ background: 'var(--blue-accent) !important', border: 'none !important', color: '#fff !important' }}>
              Generate Script
            </ButtonComp>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default InstructionalDesigner;

