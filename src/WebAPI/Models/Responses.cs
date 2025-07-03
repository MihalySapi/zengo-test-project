namespace WebAPI.Models;

public class CountyResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Dictionary<string, string> Links { get; set; } = [];
}

public class CityResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CountyId { get; set; }
    public Dictionary<string, string> Links { get; set; } = [];
}
