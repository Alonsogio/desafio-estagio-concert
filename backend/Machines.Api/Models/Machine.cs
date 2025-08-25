using System.ComponentModel.DataAnnotations;

namespace Machines.Api.Models;

public static class MachineStatuses
{
  public const string Operating = "operating";
  public const string Maintenance = "maintenance";
  public const string Offline = "offline";

  public static readonly string[] All = { Operating, Maintenance, Offline };
}

public class Machine
{
  [Key]
  public Guid Id { get; set; } = Guid.NewGuid();

  [Required, MaxLength(120)]
  public string Name { get; set; } = string.Empty;

  [MaxLength(200)]
  public string? Location { get; set; }

  public double? Latitude { get; set; }
  public double? Longitude { get; set; }

  [Required, MaxLength(40)]
  public string Status { get; set; } = MachineStatuses.Offline;
}
