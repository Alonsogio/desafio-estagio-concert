using Microsoft.AspNetCore.Mvc;
using Machines.Api.Dtos;
using Machines.Api.Services;

namespace Machines.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MachinesController(IMachineService service) : ControllerBase
{
  [HttpPost]
  public async Task<ActionResult<MachineDto>> Create([FromBody] CreateMachineDto dto)
  {
    try
    {
      var machine = await service.CreateAsync(dto);
      return CreatedAtAction(nameof(GetById), new { id = machine.Id }, machine);
    }
    catch (ArgumentException ex)
    {
      return BadRequest(ex.Message);
    }
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<MachineDto>>> GetAll([FromQuery] string? status)
  {
    var machines = await service.GetAllAsync(status);
    return Ok(machines);
  }

  [HttpGet("{id:guid}")]
  public async Task<ActionResult<MachineDto>> GetById(Guid id)
  {
    var machine = await service.GetByIdAsync(id);
    return machine is null ? NotFound() : Ok(machine);
  }

  [HttpPut("{id:guid}/telemetry")]
  public async Task<ActionResult<MachineDto>> UpdateTelemetry(Guid id, [FromBody] UpdateTelemetryDto dto)
  {
    try
    {
      var machine = await service.UpdateTelemetryAsync(id, dto);
      return machine is null ? NotFound() : Ok(machine);
    }
    catch (ArgumentException ex)
    {
      return BadRequest(ex.Message);
    }
  }
}
