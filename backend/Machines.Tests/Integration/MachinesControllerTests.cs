using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Machines.Api;
using Machines.Api.Data;
using Machines.Api.Dtos;
using Xunit;

namespace Machines.Tests.Integration;

public class MachinesControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
  private readonly WebApplicationFactory<Program> _factory;
  private readonly HttpClient _client;

  public MachinesControllerTests(WebApplicationFactory<Program> factory)
  {
    _factory = factory.WithWebHostBuilder(builder =>
    {

      builder.ConfigureServices(services =>
          {
            var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null)
              services.Remove(descriptor);

            services.AddDbContext<AppDbContext>(options =>
                {
                  options.UseInMemoryDatabase("TestDb");
                });
          });
      builder.UseSetting("environment", "Testing");
    });

    _client = _factory.CreateClient();
  }

  [Fact]
  public async Task PostMachine_ShouldCreateMachine()
  {
    var dto = new CreateMachineDto
    {
      Name = "Integration Test Machine",
      Status = "operating",
      Location = "Site X"
    };

    var response = await _client.PostAsJsonAsync("/api/machines", dto);
    response.EnsureSuccessStatusCode();

    var machine = await response.Content.ReadFromJsonAsync<MachineDto>();
    Assert.NotNull(machine);
    Assert.Equal(dto.Name, machine!.Name);
    Assert.Equal(dto.Status, machine.Status);
  }

  [Fact]
  public async Task GetMachines_ShouldReturnList()
  {
    var response = await _client.GetAsync("/api/machines");
    response.EnsureSuccessStatusCode();

    var machines = await response.Content.ReadFromJsonAsync<List<MachineDto>>();
    Assert.NotNull(machines);
  }

  [Fact]
  public async Task UpdateTelemetry_ShouldUpdateStatus()
  {
    var dto = new CreateMachineDto
    {
      Name = "Telemetry Test Machine",
      Status = "offline",
      Location = "Yard"
    };

    var createResponse = await _client.PostAsJsonAsync("/api/machines", dto);
    createResponse.EnsureSuccessStatusCode();
    var created = await createResponse.Content.ReadFromJsonAsync<MachineDto>();

    var update = new UpdateTelemetryDto
    {
      Status = "maintenance",
      Location = "Workshop"
    };

    var updateResponse = await _client.PutAsJsonAsync($"/api/machines/{created!.Id}/telemetry", update);
    updateResponse.EnsureSuccessStatusCode();

    var updated = await updateResponse.Content.ReadFromJsonAsync<MachineDto>();
    Assert.Equal("maintenance", updated!.Status);
    Assert.Equal("Workshop", updated.Location);
  }

  [Fact]
  public async Task GetById_ShouldReturnNotFound_WhenInvalidId()
  {
    var response = await _client.GetAsync($"/api/machines/{Guid.NewGuid()}");
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }
}
