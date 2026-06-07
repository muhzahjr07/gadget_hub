import React from 'react';
import { render, screen } from '@testing-library/react';
import QuotationSimulator from '../QuotationSimulator';
import '@testing-library/jest-dom';

// Mock the material-symbols-outlined span
jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  return {
    ...originReact,
    createElement: (type: any, props: any, ...children: any) => {
      if (type === 'span' && props && props.className === 'material-symbols-outlined') {
        return originReact.createElement('span', props, 'terminal');
      }
      return originReact.createElement(type, props, ...children);
    },
  };
});

describe('QuotationSimulator', () => {
  it('should render "Awaiting checkout initiation..." when logs are empty', () => {
    render(<QuotationSimulator logs={[]} />);
    expect(screen.getByText('Awaiting checkout initiation...')).toBeInTheDocument();
  });

  it('should render logs when provided', () => {
    const logs = [
      { status: 'Initiating Quotation Requests...' },
      {
        status: 'Comparing 3 quotations for SuperPhone X',
        details: [
          { distributorName: 'TechWorld', pricePerUnit: 280, availability: 15, estimatedDeliveryDays: 3, productId: 'gad-001', quotationId: 'q1' },
          { distributorName: 'ElectroCom', pricePerUnit: 275, availability: 30, estimatedDeliveryDays: 5, productId: 'gad-001', quotationId: 'q2' }
        ]
      }
    ];

    render(<QuotationSimulator logs={logs} />);

    expect(screen.getByText('Initiating Quotation Requests...')).toBeInTheDocument();
    expect(screen.getByText('Comparing 3 quotations for SuperPhone X')).toBeInTheDocument();

    // Check for distributor details
    expect(screen.getByText('TechWorld')).toBeInTheDocument();
    expect(screen.getByText('Price: $280')).toBeInTheDocument();

    expect(screen.getByText('ElectroCom')).toBeInTheDocument();
    expect(screen.getByText('Price: $275')).toBeInTheDocument();
  });
});
