
import React from 'react';
import { DistributorQuotation } from '../types';

interface Props {
  logs: Array<{ status: string; details?: any }>;
}

const QuotationSimulator: React.FC<Props> = ({ logs }) => {
  return (
    <div className="bg-background-dark p-6 rounded-2xl border border-border-dark max-h-[500px] overflow-y-auto font-mono text-sm">
      <div className="flex items-center gap-2 mb-4 text-primary font-bold">
        <span className="material-symbols-outlined">terminal</span>
        SOC Engine Monitor
      </div>
      <div className="space-y-3">
        {logs.map((log, i) => (
          <div key={i} className="animate-fade-in border-l-2 border-slate-700 pl-4 py-1">
            <p className="text-slate-400 text-xs">{new Date().toLocaleTimeString()}</p>
            <p className="text-white">{log.status}</p>
            {log.details && Array.isArray(log.details) && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {log.details.map((q: DistributorQuotation, idx) => (
                  <div key={idx} className="bg-surface-dark p-2 rounded border border-border-dark text-[10px]">
                    <p className="text-primary font-bold">{q.distributorName}</p>
                    <p>Price: Rs. {q.pricePerUnit}</p>
                    <p>Stock: {q.availability}</p>
                    <p>Ship: {q.estimatedDeliveryDays}d</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {logs.length === 0 && <p className="text-slate-600 italic">Awaiting checkout initiation...</p>}
      </div>
    </div>
  );
};

export default QuotationSimulator;
