import { QuotationRequest, DistributorQuotation } from '../types';

const API_BASE_URL = 'http://localhost:5111/api';

/**
 * Fetches quotations from the backend API.
 * @param request The quotation request details.
 * @returns A promise that resolves to an array of distributor quotations.
 */
export const fetchQuotations = async (request: QuotationRequest[]): Promise<DistributorQuotation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Order/request-quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data: DistributorQuotation[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch quotations:', error);
    throw error;
  }
};

export const placeOrder = async (items: QuotationRequest[]): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Order/place-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(items),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to place order:', error);
    throw error;
  }
};
