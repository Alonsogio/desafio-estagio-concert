using Machines.Api.Models;

namespace Machines.Api.Repositories;

public interface IMachineRepository
{
  Task AddAsync(Machine machine);
  Task<IEnumerable<Machine>> GetAllAsync(string? status);
  Task<Machine?> GetByIdAsync(Guid id);
  Task UpdateAsync(Machine machine);
  Task SaveChangesAsync();
}
