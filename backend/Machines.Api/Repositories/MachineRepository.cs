using Microsoft.EntityFrameworkCore;
using Machines.Api.Data;
using Machines.Api.Models;

namespace Machines.Api.Repositories;

public class MachineRepository : IMachineRepository
{
  private readonly AppDbContext _db;

  public MachineRepository(AppDbContext db)
  {
    _db = db;
  }

  public async Task AddAsync(Machine machine)
  {
    await _db.Machines.AddAsync(machine);
  }

  public async Task<IEnumerable<Machine>> GetAllAsync(string? status)
  {
    IQueryable<Machine> query = _db.Machines.AsNoTracking();

    if (!string.IsNullOrWhiteSpace(status))
      query = query.Where(m => m.Status == status);

    return await query.OrderBy(m => m.Name).ToListAsync();
  }

  public async Task<Machine?> GetByIdAsync(Guid id)
  {
    return await _db.Machines.FirstOrDefaultAsync(m => m.Id == id);
  }

  public async Task UpdateAsync(Machine machine)
  {
    _db.Machines.Update(machine);
    await Task.CompletedTask;
  }

  public async Task SaveChangesAsync()
  {
    await _db.SaveChangesAsync();
  }
}
