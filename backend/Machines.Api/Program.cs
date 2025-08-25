using Microsoft.EntityFrameworkCore;
using Machines.Api.Data;
using Machines.Api.Repositories;
using Machines.Api.Services;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://localhost:5190");

builder.Services.AddControllers()
       .AddJsonOptions(o => o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IMachineRepository, MachineRepository>();
builder.Services.AddScoped<IMachineService, MachineService>();

if (!builder.Environment.IsEnvironment("Testing"))
{
  builder.Services.AddDbContext<AppDbContext>(opt =>
      opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
                    ?? "Data Source=machines.db"));
}

builder.Services.AddCors(opt =>
{
  opt.AddPolicy("DevCors", p =>
      p.WithOrigins("http://localhost:4200")
       .AllowAnyHeader()
       .AllowAnyMethod());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("DevCors");

app.MapControllers();

if (!builder.Environment.IsEnvironment("Testing"))
{
  using var scope = app.Services.CreateScope();
  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
  await db.Database.MigrateAsync();
}

app.Run();

public partial class Program { }
