using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Persistence;

public class LocationDb : DbContext
{
    public LocationDb(DbContextOptions<LocationDb> options) : base(options) { }

    public DbSet<County> Counties { get; set; }
    public DbSet<City> Cities { get; set; }
}

[Index(nameof(Name), IsUnique = true)]
public class County
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public List<City> Cities { get; } = [];
}

[Index(nameof(Name), IsUnique = true)]

public class City
{    
    public int Id { get; set; }    
    public int CountyId { get; set; }
    [MaxLength(50)]
    public required string Name { get; set; }

    public County? County { get; set; }
}
