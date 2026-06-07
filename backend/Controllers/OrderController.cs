using Microsoft.AspNetCore.Mvc;
using TheGadgetHub.API.Models;
using TheGadgetHub.API.Services;

namespace TheGadgetHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly OrchestratorService _orchestrator;

    public OrderController(OrchestratorService orchestrator)
    {
        _orchestrator = orchestrator;
    }

    [HttpPost("request-quotes")]
    public async Task<IActionResult> RequestQuotes([FromBody] List<QuotationRequest> items)
    {
        // For step 1 (Quotations), we might want to just get the best quotes for display
        // The Orchestrator "GetBestQuoteAsync" does this per item.
        
        var results = new List<DistributorQuotation>();
        foreach(var item in items)
        {
            var best = await _orchestrator.GetBestQuoteAsync(item);
            results.Add(best);
        }
        
        return Ok(results);
    }

    [HttpPost("place-order")]
    public async Task<IActionResult> PlaceOrder([FromBody] List<QuotationRequest> items)
    {
        // Simple customer ID simulation
        string customerId = "CUST-001";
        
        var order = await _orchestrator.ProcessOrderAsync(items, customerId);
        return Ok(order);
    }
}
