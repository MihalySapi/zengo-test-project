// src/hooks/queries.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { citiesApi } from "../api/citiesApi";
import { countiesApi } from "../api/countiesApi";
import { type City } from "../api/models";

// Query Keys
export const queryKeys = {
  counties: ['counties'] as const,
  county: (id: number) => ['counties', id] as const,
  cities: (countyId: number) => ['cities', countyId] as const,
};

// County Queries
export const useCounties = () => {
  return useQuery({
    queryKey: queryKeys.counties,
    queryFn: countiesApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes - counties rarely change    
  });
};

export const useCounty = (countyId: number) => {
  return useQuery({
    queryKey: queryKeys.county(countyId),
    queryFn: () => countiesApi.getById(countyId),
    enabled: !!countyId,
  });
};

// City Queries
export const useCities = (countyId: number) => {
  return useQuery({
    queryKey: queryKeys.cities(countyId),
    queryFn: () => citiesApi.getByCounty(countyId),
    enabled: !!countyId,
  });
};

// City Mutations
export const useCreateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ countyId, cityName }: { countyId: number; cityName: string }) =>
      citiesApi.create(countyId, { name: cityName }),
    onSuccess: (newCity) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cities(newCity.countyId),
      });
      
      queryClient.setQueryData<City[]>(
        queryKeys.cities(newCity.countyId),
        (oldData) => oldData ? [...oldData, newCity] : [newCity]
      );
    },
  });
};

export const useUpdateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cityId, cityName }: { cityId: number; cityName: string }) =>
      citiesApi.update(cityId, { name: cityName }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cities'],});
    },
  });
};

export const useDeleteCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: citiesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cities'],});
    },
  });
};