import { fetchQuotations, placeOrder } from './apiService';
import { OrderItem, Order, QuotationRequest, DistributorQuotation } from '../types';

/**
 * Calculates potential savings based on the difference between standard list price and the best quoted price.
 */
const calculateSavings = (items: OrderItem[], quotes: DistributorQuotation[]): number => {
  let totalSavings = 0;

  quotes.forEach(quote => {
    // Find the original item to get base price
    const originalItem = items.find(i => i.product.id === quote.productId);
    if (!originalItem) return;

    // "Market Price" logic: Assumes basePrice is the standard retail price.
    // If the best quoted price is lower than base price, that's a saving.
    const marketPrice = originalItem.product.basePrice;

    if (quote.pricePerUnit < marketPrice) {
      totalSavings += (marketPrice - quote.pricePerUnit) * originalItem.quantity;
    }
  });

  return totalSavings;
};

/**
 * Step 1: Request Quotes
 */
export const getQuotationsWorkflow = async (
  items: OrderItem[],
  onProgress: (status: string, details?: any) => void
): Promise<{ quotes: DistributorQuotation[], savings: number }> => {

  onProgress('Initiating Quotation Requests...');

  const requests: QuotationRequest[] = items.map(item => ({
    productId: item.product.id,
    quantity: item.quantity
  }));

  onProgress('Finding best prices...');
  const bestQuotes = await fetchQuotations(requests);

  const savings = calculateSavings(items, bestQuotes);

  onProgress(`Found ${bestQuotes.length} verified quotations.`, bestQuotes);
  return { quotes: bestQuotes, savings };
};

/**
 * Step 2: Finalize Order
 */
export const finalizeOrderWorkflow = async (
  items: OrderItem[],
  quotes: DistributorQuotation[],
  onProgress: (status: string, details?: any) => void
): Promise<Order> => {

  onProgress('Finalizing order...');

  const requests: QuotationRequest[] = items.map(item => ({
    productId: item.product.id,
    quantity: item.quantity
  }));

  const order = await placeOrder(requests);

  // Merge product details back
  const completeOrderItems: OrderItem[] = order.items.map((apiItem: any) => {
    const original = items.find(i => i.product.id === apiItem.productId);
    return {
      product: original?.product,
      quantity: apiItem.quantity,
      selectedDistributor: apiItem.selectedDistributor,
      finalPrice: apiItem.finalPrice,
      quotationId: apiItem.quotationId
    };
  });

  const finalOrder: Order = {
    ...order,
    items: completeOrderItems
  };

  onProgress('Order finalized successfully!', finalOrder);
  return finalOrder;
};

// Deprecated: kept for compatibility if needed, but App.tsx should start using the split functions
export const processOrderWorkflow = async (
  items: OrderItem[],
  onProgress: (status: string, details?: any) => void
): Promise<Order> => {
  const { quotes } = await getQuotationsWorkflow(items, onProgress);
  return await finalizeOrderWorkflow(items, quotes, onProgress);
};
