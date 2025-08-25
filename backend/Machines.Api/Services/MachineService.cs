using Machines.Api.Dtos;
using Machines.Api.Mappings;
using Machines.Api.Models;
using Machines.Api.Repositories;

namespace Machines.Api.Services;

public class MachineService : IMachineService
{
  private readonly IMachineRepository _repo;

  public MachineService(IMachineRepository repo)
  {
    _repo = repo;
  }

  public async Task<MachineDto> CreateAsync(CreateMachineDto dto)
  {
    if (!MachineStatuses.All.Contains(dto.Status))
      throw new ArgumentException($"Invalid status. Use: {string.Join(", ", MachineStatuses.All)}");

    var entity = new Machine
    {
      Name = dto.Name,
      Location = dto.Location,
      Latitude = dto.Latitude,
      Longitude = dto.Longitude,
      Status = dto.Status
    };

    await _repo.AddAsync(entity);
    await _repo.SaveChangesAsync();

    return entity.ToDto();
  }

  public async Task<IEnumerable<MachineDto>> GetAllAsync(string? status)
  {
    var list = await _repo.GetAllAsync(status);
    return list.Select(m => m.ToDto());
  }

  public async Task<MachineDto?> GetByIdAsync(Guid id)
  {
    var machine = await _repo.GetByIdAsync(id);
    return machine?.ToDto();
  }

  public async Task<MachineDto?> UpdateTelemetryAsync(Guid id, UpdateTelemetryDto dto)
  {
    if (!MachineStatuses.All.Contains(dto.Status))
      throw new ArgumentException($"Invalid status. Use: {string.Join(", ", MachineStatuses.All)}");

    var machine = await _repo.GetByIdAsync(id);
    if (machine is null) return null;

    machine.Location = dto.Location;
    machine.Latitude = dto.Latitude;
    machine.Longitude = dto.Longitude;
    machine.Status = dto.Status;

    await _repo.UpdateAsync(machine);
    await _repo.SaveChangesAsync();

    return machine.ToDto();
  }
}
