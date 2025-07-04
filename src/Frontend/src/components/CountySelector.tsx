import { InputLabel, type SelectChangeEvent, FormControl, MenuItem, Select } from "@mui/material";
import type { County } from "../api/models";

interface CountySelectorProps {
  counties: County[];
  selectedCounty: number | null;
  onChange: (countyId: number | null) => void;
  disabled?: boolean;
}

export default function CountySelector({
  counties,
  selectedCounty,
  onChange,
  disabled = false
}: CountySelectorProps) {
  const handleChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
    onChange(value ? Number(value) : null);
  };

  return (
    <FormControl fullWidth variant="outlined" disabled={disabled}>
      <InputLabel id="county-select-label">Válassza ki a megyét</InputLabel>
      <Select
        labelId="county-select-label"
        id="county-select"
        value={selectedCounty || ''}
        onChange={handleChange}
        label="Válassza ki a megyét"
      >
        <MenuItem value="">
          <em>Válasszon</em>
        </MenuItem>
        {counties.map(county => (
          <MenuItem key={county.id} value={county.id}>
            {county.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};