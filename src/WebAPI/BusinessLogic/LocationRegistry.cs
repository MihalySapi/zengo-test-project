using Microsoft.EntityFrameworkCore;
using WebAPI.Persistence;

namespace WebAPI.BusinessLogic;

public class LocationRegistry
{
    private readonly LocationDb _dbContext;

    public LocationRegistry(LocationDb dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<County>> GetCountiesAsync()
    {
        return await _dbContext.Counties
            .AsNoTracking()
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<IEnumerable<City>> GetCitiesAsync(int countyId)
    {
        return await _dbContext.Cities
            .Where(city => city.CountyId == countyId)
            .AsNoTracking()
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<T?> GetAsync<T>(int id) where T : class
    {
        T? entity = await _dbContext.Set<T>().FindAsync(id).ConfigureAwait(false);
        return entity;
    }

    public async Task AddCityAsync(City newCity)
    {
        ArgumentNullException.ThrowIfNull(newCity, nameof(newCity));

        _dbContext.Cities.Add(newCity);
        await _dbContext.SaveChangesAsync().ConfigureAwait(false);
    }

    public async Task UpdateCityNameAsync(City? cityToUpdate, string name)
    {
        ArgumentNullException.ThrowIfNull(cityToUpdate, nameof(cityToUpdate));

        if (cityToUpdate.Name.Equals(name, StringComparison.InvariantCulture))
        {
            return;
        }

        cityToUpdate.Name = name;
        await _dbContext.SaveChangesAsync().ConfigureAwait(false);
    }

    public async Task DeleteCityAsync(City cityToDelete)
    {
        ArgumentNullException.ThrowIfNull(cityToDelete, nameof(cityToDelete));

        _dbContext.Cities.Remove(cityToDelete);
        await _dbContext.SaveChangesAsync().ConfigureAwait(false);
    }
}
