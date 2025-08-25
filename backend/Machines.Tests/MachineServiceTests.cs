using Moq;
using Machines.Api.Dtos;
using Machines.Api.Models;
using Machines.Api.Repositories;
using Machines.Api.Services;
using Xunit; // Certifique-se de usar Xunit

namespace Machines.Tests;

public class MachineServiceTests
{
  private readonly Mock<IMachineRepository> _repoMock;
  private readonly MachineService _service;

  public MachineServiceTests()
  {
    _repoMock = new Mock<IMachineRepository>();
    _service = new MachineService(_repoMock.Object);
  }

  [Fact]
  public async Task CreateAsync_ShouldCreateMachine_WhenValidDto()
  {
    var dto = new CreateMachineDto
    {
      Name = "Test Machine",
      Status = MachineStatuses.Operating,
      Location = "Site A"
    };

    var result = await _service.CreateAsync(dto);

    Assert.Equal(dto.Name, result.Name);
    Assert.Equal(dto.Status, result.Status);
    _repoMock.Verify(r => r.AddAsync(It.IsAny<Machine>()), Times.Once);
    _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
  }

  [Fact]
  public async Task CreateAsync_ShouldThrow_WhenInvalidStatus()
  {
    var dto = new CreateMachineDto { Name = "Invalid", Status = "wrong_status" };

    await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateAsync(dto));
  }
}
