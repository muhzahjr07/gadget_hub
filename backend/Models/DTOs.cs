using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TheGadgetHub.API.Models;

public record QuotationRequest(
    [Required]
    [property: JsonPropertyName("productId")] string ProductId,

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    [property: JsonPropertyName("quantity")] int Quantity
);

public record DistributorQuotation(
    [property: JsonPropertyName("distributorName")] string DistributorName,
    [property: JsonPropertyName("productId")] string ProductId,
    [property: JsonPropertyName("pricePerUnit")] decimal PricePerUnit,
    [property: JsonPropertyName("availability")] int Availability,
    [property: JsonPropertyName("estimatedDeliveryDays")] int EstimatedDeliveryDays,
    [property: JsonPropertyName("quotationId")] string QuotationId
);

public record OrderItem(
    [property: JsonPropertyName("productId")] string ProductId,
    [property: JsonPropertyName("quantity")] int Quantity,
    [property: JsonPropertyName("selectedDistributor")] string SelectedDistributor,
    [property: JsonPropertyName("finalPrice")] decimal FinalPrice,
    [property: JsonPropertyName("quotationId")] string QuotationId
);

public record Order(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("customerId")] string CustomerId,
    [property: JsonPropertyName("items")] List<OrderItem> Items,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("totalAmount")] decimal TotalAmount,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt,
    [property: JsonPropertyName("trackingId")] string TrackingId
);
