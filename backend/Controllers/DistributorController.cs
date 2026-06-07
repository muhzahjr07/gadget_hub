using Microsoft.AspNetCore.Mvc;

namespace TheGadgetHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DistributorController : ControllerBase
{
    [HttpGet]
    public IActionResult HealthCheck()
    {
        // Simple health check response
        return Ok(new 
        { 
            status = "Service Online", 
            timestamp = DateTime.UtcNow 
        });
    }

    [HttpGet("list")]
    public IActionResult GetDistributors()
    {
        // For debugging/listing available distributors
        return Ok(new[] { "TechWorld", "Gadget Central" });
    }
}
