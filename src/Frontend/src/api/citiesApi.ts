import fetchApi from "./api";
import type { City, CityRequest, ApiError } from "./models";


export const citiesApi = {
  getByCounty: async (countyId: number): Promise<City[]> => {
    const response = await fetchApi(`/counties/${countyId}/cities`);
    if (!response.ok) {
      throw new Error('A lekérdezés sikertelen.');
    }
    return response.json();
  },

  create: async (countyId: number, cityData: CityRequest): Promise<City> => {
    const response = await fetchApi(`/counties/${countyId}/cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cityData),
    });

    if (!response.ok) {
      await HandleError(response);
    }

    return response.json();
  },

  update: async (cityId: number, cityData: CityRequest): Promise<void> => {
    const response = await fetchApi(`/cities/${cityId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cityData),
    });

    if (!response.ok) {
      await HandleError(response);
    }
  },

  delete: async (cityId: number): Promise<void> => {
    const response = await fetchApi(`/cities/${cityId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('A törlés sikertelen.');
    }
  },
};

async function HandleError(response: Response) {
  if (response.status === 400) {
    const errorData: ApiError = await response.json();

    if (!!errorData.detail && errorData.detail.includes("UNIQUE constraint failed: Cities.Name")) {
      throw new Error('Ezzel a névvel már létezik város.');
    }
  }

  throw new Error('A léterhozás sikertelen.');
}

