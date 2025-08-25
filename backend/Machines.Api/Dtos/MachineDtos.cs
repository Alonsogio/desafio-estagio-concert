using System.ComponentModel.DataAnnotations;
using Machines.Api.Models;

namespace Machines.Api.Dtos;

public record MachineDto(
    Guid Id, string Name, string? Location, double? Latitude, double? Longitude, string Status);

public class CreateMachineDto
{
  [Required, MaxLength(120)]
  public string Name { get; set; } = string.Empty;

  [MaxLength(200)]
  public string? Location { get; set; }

  public double? Latitude { get; set; }
  public double? Longitude { get; set; }

  [Required]
  public string Status { get; set; } = MachineStatuses.Offline;
}

public class UpdateTelemetryDto
{
  [MaxLength(200)]
  public string? Location { get; set; }

  public double? Latitude { get; set; }
  public double? Longitude { get; set; }

  [Required]
  public string Status { get; set; } = MachineStatuses.Offline;
}
