import { Box } from "@mui/material";

import AddCityForm from "./AddCityForm";
import CitiesList from "./CitiesList";
import { ErrorProvider } from "../contexts/ErrorContext";

interface CityManagerProps {
  countyId: number;
}

export default function CityManager({ countyId }: CityManagerProps) {
  return (
    <ErrorProvider>
      <Box>
        <AddCityForm countyId={countyId} />
        <CitiesList countyId={countyId} />
      </Box>
    </ErrorProvider>
  );
};