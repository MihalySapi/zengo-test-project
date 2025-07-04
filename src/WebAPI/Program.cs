using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using WebAPI.BusinessLogic;
using WebAPI.Models;
using WebAPI.Persistence;

var builder = WebApplication.CreateBuilder(args);
#region DI Configuration

builder.Services.AddOpenApi();

builder.Services.AddDbContext<LocationDb>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("LocationDatabase"));
    opt.UseSeeding((context, _) =>
    {
        // Initialize DB content if needed
        var numberOfCounties = context.Set<County>().Count();
        if (numberOfCounties > 0) { return; }

        context.Set<County>().AddRange(SeedData.Counties);
        context.SaveChanges();
    });
    opt.UseAsyncSeeding(async (context, _, cancellationToken) =>
    {
        // Initialize DB content if needed
        var numberOfCounties = await context.Set<County>().CountAsync(cancellationToken); 
        if (numberOfCounties > 0) { return; }
        
        context.Set<County>().AddRange(SeedData.Counties);
        await context.SaveChangesAsync(cancellationToken);
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<LocationRegistry>();

builder.Services.AddHealthChecks();
builder.Services.AddProblemDetails();

#endregion

var app = builder.Build();
#region App Configuration

app.UseCors("AllowReactApp");

// Initialize DB content
await using (var serviceScope = app.Services.CreateAsyncScope())
await using (var dbContext = serviceScope.ServiceProvider.GetRequiredService<LocationDb>())
{
    await dbContext.Database.EnsureCreatedAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
app.MapHealthChecks("/healthy");
app.UseHttpsRedirection();

app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        var exceptionHandlerFeature = context.Features.Get<IExceptionHandlerFeature>();
        if (exceptionHandlerFeature?.Error?.InnerException is not SqliteException) { return; }

        var problemDetailsService = context.RequestServices.GetRequiredService<IProblemDetailsService>();
        context.Response.StatusCode = StatusCodes.Status400BadRequest;

        await problemDetailsService.TryWriteAsync(
            new ProblemDetailsContext 
            {
                HttpContext = context,
                ProblemDetails = new ProblemDetails
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Invalid database operation",
                    Detail = exceptionHandlerFeature.Error.InnerException.Message,
                    Type = "Bad Request"
                }
            });
    });
});

# endregion

// Endpoints
app.MapGet("/counties", async (LocationRegistry locations) =>
{
    IEnumerable<County> counties = await locations.GetCountiesAsync();

    var response = ResponseFactory.CreateCountiesResponse(counties);
    return Results.Ok(response);
});

app.MapGet("/counties/{countyId}/cities", async (int countyId, LocationRegistry locations) =>
{
    County? county = await locations.GetAsync<County>(countyId);
    if (county == null) { return Results.NotFound(); }

    IEnumerable<City> cities = await locations.GetCitiesAsync(county.Id);

    var response = ResponseFactory.CreateCitiesResponse(cities);
    return Results.Ok(response);
});

app.MapPost("/counties/{countyId}/cities", async (int countyId, [FromBody]CreateCityRequest request, LocationRegistry locations) =>
{
    County? county = await locations.GetAsync<County>(countyId);
    if (county == null) { return Results.NotFound(); }

    var city = new City
    {
        CountyId = countyId,
        Name = request.Name
    };
    await locations.AddCityAsync(city);

    return Results.Created($"/cities/{city.Id}", ResponseFactory.CreateCityResponse(city));
});

app.MapPatch("/cities/{cityId}", async (int cityId, [FromBody]UpdateCityRequest request, LocationRegistry locations) =>
{    
    City? city = await locations.GetAsync<City>(cityId);
    if (city == null) { return Results.NotFound(); }

    await locations.UpdateCityNameAsync(city, request.Name);
    return Results.NoContent();
});

app.MapDelete("/cities/{cityId}", async (int cityId, LocationRegistry locations) =>
{
    City? city = await locations.GetAsync<City>(cityId);
    if (city == null) { return Results.NotFound(); }

    await locations.DeleteCityAsync(city);
    return Results.NoContent();
});

app.Run();