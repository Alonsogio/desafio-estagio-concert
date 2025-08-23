using Microsoft.EntityFrameworkCore;
using Machines.Api.Models;

namespace Machines.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
  public DbSet<Machine> Machines => Set<Machine>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Machine>()
        .Property(p => p.Status)
        .HasDefaultValue(MachineStatuses.Offline);
  }
}
