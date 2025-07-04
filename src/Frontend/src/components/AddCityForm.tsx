import { useState } from "react";
import { useCreateCity } from "../hooks/queryHooks";
import { Box, Button,  Paper, TextField, Typography } from "@mui/material";
import { useError } from "../contexts/ErrorContext";

interface AddCityFormProps {
  countyId: number;
  onSuccess?: () => void;
}

export default function AddCityForm({ countyId, onSuccess }: AddCityFormProps) {
  const [newCityName, setNewCityName] = useState('');
  const createCityMutation = useCreateCity();
  const { showError } = useError();
  
  const trimmedName = newCityName.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedName) return;
    
    try {
      await createCityMutation.mutateAsync({
          countyId,
          cityName: trimmedName
      });
      setNewCityName('');
      onSuccess?.();
    } catch (error){
      showError((error as Error).message);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        background: '#1fdecd'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Új város hozzáadása
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          label="Város neve"
          value={newCityName}
          onChange={(e) => setNewCityName(e.target.value)}
          disabled={createCityMutation.isPending}
          required          
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={createCityMutation.isPending || !trimmedName}
          sx={{
            minWidth: 120,
            height: 56,
            background: '#007bff',
          }}
        >
          {createCityMutation.isPending ? 'Hozzáadás...' : 'Hozzáadás'}
        </Button>
      </Box>
    </Paper>
  );
};