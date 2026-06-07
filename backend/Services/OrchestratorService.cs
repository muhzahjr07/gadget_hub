using TheGadgetHub.API.Models;

namespace TheGadgetHub.API.Services;

public class OrchestratorService
{
    private readonly IEnumerable<IDistributorService> _distributors;

    public OrchestratorService(IEnumerable<IDistributorService> distributors)
    {
        _distributors = distributors;
    }

    public async Task<DistributorQuotation> GetBestQuoteAsync(QuotationRequest request)
    {
        var tasks = _distributors.Select(d => d.GetQuotationAsync(request));
        var quotes = await Task.WhenAll(tasks);

        // Business Logic: Select Best Quote
        // 1. Filter by availability (must satisfy quantity)
        var validQuotes = quotes.Where(q => q.Availability >= request.Quantity).ToList();

        if (!validQuotes.Any())
        {
            // Fallback: Just get the one with max stock if none can fully satisfy
            return quotes.OrderByDescending(q => q.Availability).First();
        }

        // 2. Sort by Price (Ascending), then Delivery (Ascending)
        var bestQuote = validQuotes
            .OrderBy(q => q.PricePerUnit)
            .ThenBy(q => q.EstimatedDeliveryDays)
            .First();

        return bestQuote;
    }

    public async Task<Order> ProcessOrderAsync(List<QuotationRequest> items, string customerId)
    {
        var orderItems = new List<OrderItem>();
        decimal total = 0;

        foreach (var item in items)
        {
            var bestQuote = await GetBestQuoteAsync(item);
            
            // Confirm with distributor
            var distributor = _distributors.First(d => d.Name == bestQuote.DistributorName);
            await distributor.ConfirmOrderAsync(bestQuote.QuotationId);

            orderItems.Add(new OrderItem(
                item.ProductId,
                item.Quantity,
                bestQuote.DistributorName,
                bestQuote.PricePerUnit,
                bestQuote.QuotationId
            ));

            total += bestQuote.PricePerUnit * item.Quantity;
        }

        return new Order(
            $"ORD-{Guid.NewGuid().ToString().Substring(0,8).ToUpper()}",
            customerId,
            orderItems,
            "Confirmed",
            total,
            DateTime.UtcNow,
            $"TRK-{Guid.NewGuid().ToString().Substring(0,10).ToUpper()}"
        );
    }
}
