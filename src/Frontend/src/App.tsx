import { useState } from 'react'
import './App.css'
import { useCounties } from './hooks/queryHooks';
import { Box, Paper, Typography, LinearProgress, Alert, Container } from '@mui/material';
import CountySelector from './components/CountySelector';
import CityManager from './components/CityManager';

function App() {
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);
  
  const { data: counties = [], isLoading: countiesLoading, error: countiesError } = useCounties();

  const handleCountyChange = (countyId: number | null) => {
    setSelectedCounty(countyId);
  };

  // Loading state
  if (countiesLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          minWidth: '100vw',
          background: 'linear-gradient(87deg, #38b5aa, #008acd 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            maxWidth: 600,
            width: '100%',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Megyék betöltése...
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Paper>
      </Box>
    );
  }

  // Error state
  if (countiesError) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          minWidth: '100vw',
          background: 'linear-gradient(87deg, #38b5aa, #008acd 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            maxWidth: 600,
            width: '100%'
          }}
        >
          <Alert severity="error">
            Hiba történt a megyék betöltésekor: {(countiesError as Error).message}
          </Alert>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(87deg, #38b5aa, #008acd 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              textAlign: 'center',
              background: '#007bff',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 4
            }}
          >
            Város Kezelő Alkalmazás - verzió: 0.2
          </Typography>
          
          <CountySelector
            counties={counties}
            selectedCounty={selectedCounty}
            onChange={handleCountyChange}
          />

          {selectedCounty && (
            <Box sx={{ mt: 4 }}>
              <CityManager countyId={selectedCounty} />
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App
