
import React from 'react';

const ArchitectureView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in text-slate-300">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold text-white border-b border-primary/30 pb-4">Architectural Analysis: The Gadget Hub</h1>

        <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl mb-8">
          <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">description</span>
            Assessment Note: .NET Integration
          </h3>
          <p className="text-sm">
            The backend for 'The Gadget Hub' is developed using <strong>ASP.NET Core Web APIs</strong>. Each distributor connector is a separate .NET Microservice, ensuring high throughput and strict type safety via C#. The frontend (this application) consumes these services via RESTful JSON endpoints.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface-dark p-6 rounded-xl border border-border-dark shadow-xl">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">dataset</span> Monolithic Model
            </h2>
            <p className="text-sm leading-relaxed mb-4 italic text-slate-400">
              "Single codebase, single deployable unit."
            </p>
            <ul className="text-xs space-y-2 opacity-80">
              <li className="flex gap-2"><span className="text-red-400">✗</span> <strong>Rigidity:</strong> A bug in the TechWorld quote logic can take down the entire store.</li>
              <li className="flex gap-2"><span className="text-red-400">✗</span> <strong>Deployment:</strong> Re-deploying for a small text change requires taking the whole app offline.</li>
              <li className="flex gap-2"><span className="text-red-400">✗</span> <strong>Scaling:</strong> Cannot scale the "Comparison Engine" independently of the "User Profile" service.</li>
            </ul>
          </div>

          <div className="bg-surface-dark p-6 rounded-xl border border-primary/20 shadow-2xl shadow-primary/5">
            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">account_tree</span> SOC / SOA Model
            </h2>
            <p className="text-sm leading-relaxed mb-4 italic text-slate-400">
              "Independently deployable, loosely coupled services."
            </p>
            <ul className="text-xs space-y-2 opacity-80">
              <li className="flex gap-2"><span className="text-green-400">✓</span> <strong>Maintainability:</strong> Update ElectroCom service logic without touching Gadget Central.</li>
              <li className="flex gap-2"><span className="text-green-400">✓</span> <strong>Scalability:</strong> Horizontal Pod Autoscaling (HPA) in Kubernetes clones specific services under load.</li>
              <li className="flex gap-2"><span className="text-green-400">✓</span> <strong>Reusability:</strong> The quotation comparison logic can be exposed to mobile or B2B clients easily.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined">cloud_done</span> Deployment & Delivery
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface-dark rounded-xl border border-border-dark hover:border-primary/50 transition-all">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">terminal</span> Docker
            </h3>
            <p className="text-xs text-slate-400">Encapsulates the .NET Runtime and dependencies into an immutable image, solving the "it works on my machine" problem.</p>
          </div>
          <div className="p-6 bg-surface-dark rounded-xl border border-border-dark hover:border-primary/50 transition-all">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">view_quilt</span> Kubernetes
            </h3>
            <p className="text-xs text-slate-400">Manages container lifecycles, self-healing (restarting crashed .NET instances), and load balancing across service clusters.</p>
          </div>
          <div className="p-6 bg-surface-dark rounded-xl border border-border-dark hover:border-primary/50 transition-all">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">speed</span> CI/CD
            </h3>
            <p className="text-xs text-slate-400">Automated GitHub Actions run our Unit/Integration tests before building Docker images and deploying to the Cloud.</p>
          </div>
        </div>
      </section>

      <section className="p-8 bg-primary/5 border border-primary/20 rounded-3xl">
        <h2 className="text-xl font-bold text-white mb-4">SOC Pattern Justification</h2>
        <p className="text-sm leading-relaxed mb-4">
          For "The Gadget Hub," **Service-Oriented Architecture** is superior because it allows the business to add new distributors dynamically. Using the **Broker Pattern**, the central Hub acts as an orchestrator that abstracts the heterogeneous nature of various distributor APIs into a unified internal model.
        </p>
        <div className="flex gap-4">
          <span className="px-3 py-1 bg-white/10 text-[10px] font-bold rounded">AUTONOMY</span>
          <span className="px-3 py-1 bg-white/10 text-[10px] font-bold rounded">COMPOSABILITY</span>
          <span className="px-3 py-1 bg-white/10 text-[10px] font-bold rounded">ABSTRACTION</span>
        </div>
      </section>
    </div>
  );
};

export default ArchitectureView;
