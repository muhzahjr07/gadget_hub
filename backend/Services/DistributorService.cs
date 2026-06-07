using TheGadgetHub.API.Models;

namespace TheGadgetHub.API.Services;

public interface IDistributorService
{
    string Name { get; }
    Task<DistributorQuotation> GetQuotationAsync(QuotationRequest request);
    Task<bool> ConfirmOrderAsync(string quotationId);
}

public class DistributorService : IDistributorService
{
    public string Name { get; }
    private static readonly Random _random = new();
    private static readonly Dictionary<string, decimal> _basePrices = new()
    {
        { "gad-001", 84000m },
        { "gad-002", 126000m },
        { "gad-003", 25500m },
        { "gad-004", 36000m },
        { "gad-005", 255000m },
        { "gad-006", 111000m },
        { "gad-007", 185000m },
        { "gad-008", 45000m },
        { "gad-009", 12500m },
        { "gad-010", 4500m },
        { "gad-011", 28000m },
        { "gad-012", 8500m }
    };

    public DistributorService(string name)
    {
        Name = name;
    }

    public async Task<DistributorQuotation> GetQuotationAsync(QuotationRequest request)
    {
        // Simulate network delay
        await Task.Delay(500 + _random.Next(500));

        // Simulate business logic for dynamic pricing and stock
        var variability = (_random.NextDouble() - 0.5) * 0.1; // +/- 5% price variance
        var basePrice = _basePrices.GetValueOrDefault(request.ProductId, 30000m);
        
        var pricePerUnit = Math.Round(basePrice * (decimal)(1 + variability), 2);
        var availability = _random.Next(50) + (Name == "TechWorld" ? 5 : 20); 
        var deliveryDays = _random.Next(5) + 2;

        return new DistributorQuotation(
            Name,
            request.ProductId,
            pricePerUnit,
            availability,
            deliveryDays,
            $"QUO-{Name.Substring(0, 2).ToUpper()}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}"
        );
    }

    public async Task<bool> ConfirmOrderAsync(string quotationId)
    {
        // Simulate processing time
        await Task.Delay(500);
        return true; 
    }
}
