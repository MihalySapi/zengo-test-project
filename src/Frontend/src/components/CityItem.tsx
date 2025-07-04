import { ListItem, Box, TextField, Button, ListItemText, Chip, IconButton } from "@mui/material";
import React, { useState } from "react";
import type { City } from "../api/models";
import { useUpdateCity, useDeleteCity } from "../hooks/queryHooks";
import { Save, Delete } from "@mui/icons-material";
import Cancel from "@mui/icons-material/Cancel";
import Edit from "@mui/icons-material/Edit";
import { useError } from "../contexts/ErrorContext";

interface CityItemProps {
  city: City;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}

export default function CityItem ({
  city,
  isEditing,
  onEdit,
  onCancelEdit
}: CityItemProps) {
  const [editingName, setEditingName] = useState(city.name);
  const { showError } = useError();
  const updateCityMutation = useUpdateCity();
  const deleteCityMutation = useDeleteCity();  

  const isPending = updateCityMutation.isPending || deleteCityMutation.isPending
  const trimmedName = editingName.trim();

  const handleUpdate = async () => {
    if (!trimmedName) return;

    try {      
      await updateCityMutation.mutateAsync({
        cityId: city.id,
        cityName: trimmedName 
      });
      onCancelEdit();
    } catch (error) {
      showError((error as Error).message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Biztosan törölni szeretné a "${city.name}" nevű várost?`)) {
      try {
        await deleteCityMutation.mutateAsync(city.id);
      } catch (error) {
        showError((error as Error).message);
      }
    }
  };

  const handleCancel = () => {
    setEditingName(city.name);
    onCancelEdit();
  };

  // Reset editing name when entering edit mode
  React.useEffect(() => {
    if (isEditing) {
      setEditingName(city.name);
    }
  }, [isEditing, city.name]);

  if (isEditing) {
    return (
      <ListItem
        sx={{
          background: ' #02caf7',
          borderRadius: 2,
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>          
          <TextField
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            size="small"
            variant="outlined"
            disabled={updateCityMutation.isPending}
            autoFocus                    
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}            
            sx={{ 
              flexGrow: 1,               
            }}
          />
          <Button
            onClick={handleUpdate}
            disabled={isPending || !trimmedName}
            size="small"
            variant="contained"
            color="success"
            startIcon={<Save />}
          >
            {updateCityMutation.isPending ? 'Mentés...' : 'Módosít'}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            size="small"
            variant="contained"
            color="error"
            startIcon={<Delete />}
          >
            {deleteCityMutation.isPending ? 'Törlés...' : 'Törlés'}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isPending}
            size="small"
            variant="contained"
            startIcon={<Cancel />}
          >
            Mégsem
          </Button>
        </Box>
      </ListItem>
    );
  }

  return (
    <ListItem
      sx={{
        background: ' #02caf7',        
        borderRadius: 2,
        mb: 1,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }
      }}      
      secondaryAction={
        <IconButton
          edge="end"
          onClick={() => onEdit()}
          size="small"
        >
          <Edit />
        </IconButton>
      }
    >
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={city.name} size="medium" sx={{ fontWeight: 500, }} />
          </Box>
        }
      />
    </ListItem>
  );
};