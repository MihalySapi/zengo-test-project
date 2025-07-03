using WebAPI.Persistence;

namespace WebAPI.Models;

public static class ResponseFactory
{
    public static IEnumerable<CityResponse> CreateCitiesResponse(IEnumerable<City> cities)
    {
        ArgumentNullException.ThrowIfNull(cities, nameof(cities));

        return cities.Select(CreateCityResponse);
    }
        

    public static IEnumerable<CountyResponse> CreateCountiesResponse(IEnumerable<County> counties)
    {
        ArgumentNullException.ThrowIfNull(counties, nameof(counties));

        return counties.Select(CreateCountyResponse);
    }

    public static CountyResponse CreateCountyResponse(County county)
    {
        ArgumentNullException.ThrowIfNull(county, nameof(county));

        return new CountyResponse
        {
            Id = county.Id,
            Name = county.Name,
            Links = new Dictionary<string, string>
            {
                { "self", $"/counties/{county.Id}" },
                { "cities", $"/counties/{county.Id}/cities" }
            }
        };
    }

    public static CityResponse CreateCityResponse(City city)
    {
        ArgumentNullException.ThrowIfNull(city, nameof(city));

        return new CityResponse
        {
            Id = city.Id,
            Name = city.Name,
            CountyId = city.CountyId,
            Links = new Dictionary<string, string>
            {
                { "self", $"/cities/{city.Id}" },
                { "county", $"/counties/{city.CountyId}" },
                { "update", $"/cities/{city.Id}" },
                { "delete", $"/cities/{city.Id}" }
            }
        };
    }
}