using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace WebAPI.Models;

public class CreateCityRequest
{
    [BindRequired]
    public required string Name { get; set; }
};

public class UpdateCityRequest
{
    [BindRequired]
    public required string Name { get; set; }
};
