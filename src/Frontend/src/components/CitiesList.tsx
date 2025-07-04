import { Paper, Typography, Box, LinearProgress, Alert, List } from "@mui/material";
import { useState } from "react";
import { useCities } from "../hooks/queryHooks";
import CityItem from "./CityItem";
import LocationCity from "@mui/icons-material/LocationCity";

interface CitiesListProps {
  countyId: number;
}

export default function CitiesList ({ countyId }: CitiesListProps) {
  const [editingCityId, setEditingCityId] = useState<number | null>(null);
  const { data: cities = [], isLoading, error } = useCities(countyId);

  const handleEdit = (cityId: number) => {
    setEditingCityId(cityId);
  };

  const handleCancelEdit = () => {
    setEditingCityId(null);
  };

  if (isLoading) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Városok
        </Typography>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Városok betöltése...
          </Typography>
          <LinearProgress />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Városok
        </Typography>
        <Alert severity="error">
          Hiba történt a városok betöltésekor: {(error as Error).message}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <LocationCity color="primary" />
        <Typography variant="h6">
          Városok
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ({cities.length} db)
        </Typography>
      </Box>
      
      {cities.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Még nincsenek városok ebben a megyében.
        </Alert>
      ) : (
        <List>
          {cities.map(city => (
            <CityItem
              key={city.id}
              city={city}
              isEditing={editingCityId === city.id}
              onEdit={() => handleEdit(city.id)}
              onCancelEdit={handleCancelEdit}
            />
          ))}
        </List>
      )}
    </Paper>
  );
};