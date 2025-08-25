using Machines.Api.Dtos;

namespace Machines.Api.Services;

public interface IMachineService
{
  Task<MachineDto> CreateAsync(CreateMachineDto dto);
  Task<IEnumerable<MachineDto>> GetAllAsync(string? status);
  Task<MachineDto?> GetByIdAsync(Guid id);
  Task<MachineDto?> UpdateTelemetryAsync(Guid id, UpdateTelemetryDto dto);
}
