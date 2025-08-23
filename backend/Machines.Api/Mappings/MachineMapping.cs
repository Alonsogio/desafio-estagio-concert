using Machines.Api.Dtos;
using Machines.Api.Models;

namespace Machines.Api.Mappings;

public static class MachineMapping
{
  public static MachineDto ToDto(this Machine m) =>
      new(m.Id, m.Name, m.Location, m.Latitude, m.Longitude, m.Status);
}
