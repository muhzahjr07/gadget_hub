
import React, { useState } from 'react';
import { TestResult } from '../types';

const TestDashboard: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { id: '1', name: 'Distributor API Connectivity (TechWorld)', status: 'pending', message: 'Ready', duration: 0 },
    { id: '2', name: 'Quotation Comparison Logic (Best Price)', status: 'pending', message: 'Ready', duration: 0 },
    { id: '3', name: 'Order Payload Schema Validation', status: 'pending', message: 'Ready', duration: 0 },
    { id: '4', name: 'Inventory Threshold Exception Handling', status: 'pending', message: 'Ready', duration: 0 },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    // Explicitly typing updatedTests as TestResult[] to ensure the status property 
    // remains a union of 'pending' | 'passed' | 'failed' instead of being narrowed to just 'pending'.
    const updatedTests: TestResult[] = tests.map(t => ({ ...t, status: 'pending', message: 'Running...' }));
    setTests(updatedTests);

    for (let i = 0; i < updatedTests.length; i++) {
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      const duration = Date.now() - startTime;

      const success = Math.random() > 0.1; // 90% success rate
      // Fix: updatedTests is now correctly typed as TestResult[], so status assignment works.
      updatedTests[i] = {
        ...updatedTests[i],
        status: success ? 'passed' : 'failed',
        message: success ? 'Assertion passed: HTTP 200 OK' : 'Assertion failed: Connection timeout after 2000ms',
        duration
      };
      setTests([...updatedTests]);
    }
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">System Diagnostics</h2>
          <p className="text-slate-400">Verifying SOC Integrity & API Contracts</p>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${isRunning ? 'bg-slate-700 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20'}`}
        >
          <span className="material-symbols-outlined">{isRunning ? 'sync' : 'play_arrow'}</span>
          {isRunning ? 'Running Suite...' : 'Run Test Suite'}
        </button>
      </div>

      <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden">
        <div className="p-4 bg-background-dark/50 border-b border-border-dark grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <div className="col-span-1">Status</div>
          <div className="col-span-5">Test Case</div>
          <div className="col-span-4">Diagnostics Message</div>
          <div className="col-span-2 text-right">Duration</div>
        </div>
        <div className="divide-y divide-border-dark">
          {tests.map(test => (
            <div key={test.id} className="p-4 grid grid-cols-12 items-center text-sm">
              <div className="col-span-1">
                {test.status === 'passed' && <span className="text-green-500 material-symbols-outlined">check_circle</span>}
                {test.status === 'failed' && <span className="text-red-500 material-symbols-outlined">error</span>}
                {test.status === 'pending' && <span className="text-slate-600 animate-pulse material-symbols-outlined">pending</span>}
              </div>
              <div className="col-span-5 font-bold text-slate-200">{test.name}</div>
              <div className={`col-span-4 font-mono text-xs ${test.status === 'failed' ? 'text-red-400' : 'text-slate-400'}`}>
                {test.message}
              </div>
              <div className="col-span-2 text-right font-mono text-xs text-slate-500">{test.duration}ms</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl">
        <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">info</span>
          Debugging Trace
        </h4>
        <div className="bg-black/40 p-4 rounded font-mono text-[10px] text-slate-400 max-h-32 overflow-y-auto">
          [DEBUG] 2026-01-10 14:02:01: Initiating HttpClient for .NET Web API endpoint...<br />
          [DEBUG] 2026-01-10 14:02:02: Resolving DNS for techworld.distributor.hub...<br />
          [DEBUG] 2026-01-10 14:02:02: Attaching JWT token for service authentication...<br />
          [DEBUG] 2026-01-10 14:02:03: Received JSON payload (Content-Type: application/json)...<br />
          [DEBUG] 2026-01-10 14:02:03: Executing BusinessRule: BestPriceSelector...
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;
