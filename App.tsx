
import React, { useState, useEffect, useMemo } from 'react';
import { ViewState, Product, OrderItem, Order } from './types';
import { MOCK_PRODUCTS } from './constants';
import { getQuotationsWorkflow, finalizeOrderWorkflow } from './services/orderService';
import ArchitectureView from './components/ArchitectureView';
import QuotationSimulator from './components/QuotationSimulator';
import TestDashboard from './components/TestDashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.CATALOG);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<Array<{ status: string; details?: any }>>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Confirmation State
  const [isWaitingConfirmation, setIsWaitingConfirmation] = useState(false);
  const [pendingQuotes, setPendingQuotes] = useState<any[]>([]);
  const [calculatedSavings, setCalculatedSavings] = useState(0);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const cartTotal = useMemo(() =>
    cart.reduce((acc, item) => acc + item.product.basePrice * item.quantity, 0)
    , [cart]);

  const categories = useMemo(() => ['All', ...new Set(MOCK_PRODUCTS.map(p => p.category))], []);

  const filteredProducts = useMemo(() => {
    return selectedCategory === 'All'
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setShowToast(true);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    setCurrentView(ViewState.CHECKOUT_PROCESS);
    setLogs([]);
    setIsWaitingConfirmation(false);
    setCurrentOrder(null);

    try {
      const { quotes, savings } = await getQuotationsWorkflow(cart, (status, details) => {
        setLogs(prev => [...prev, { status, details }]);
      });

      setPendingQuotes(quotes);
      setCalculatedSavings(savings);
      setIsWaitingConfirmation(true);
      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, { status: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]);
      setIsProcessing(false);
    }
  };

  const confirmOrder = async () => {
    setIsProcessing(true);
    setIsWaitingConfirmation(false);

    try {
      const finalizedOrder = await finalizeOrderWorkflow(cart, pendingQuotes, (status, details) => {
        setLogs(prev => [...prev, { status, details }]);
      });

      setCurrentOrder(finalizedOrder);
      setOrders(prev => [finalizedOrder, ...prev]);
      setCart([]);
      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, { status: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]);
      setIsProcessing(false);
    }
  };

  const downloadInvoice = (order: Order) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(order, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${order.id}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-200">
      <header className="sticky top-0 z-50 glass border-b border-border-dark h-20 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView(ViewState.CATALOG)}>
          <div className="size-10 bg-primary/20 flex items-center justify-center rounded-xl text-primary">
            <span className="material-symbols-outlined text-3xl">hub</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">The Gadget Hub</h1>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">SOC Framework v2.1</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => setCurrentView(ViewState.CATALOG)} className={`${currentView === ViewState.CATALOG ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'} transition-all py-2`}>Catalog</button>
          <button onClick={() => setCurrentView(ViewState.ORDERS)} className={`${currentView === ViewState.ORDERS ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'} transition-all py-2`}>Orders</button>
          <button onClick={() => setCurrentView(ViewState.TESTING)} className={`${currentView === ViewState.TESTING ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'} transition-all py-2`}>Testing</button>
          <button onClick={() => setCurrentView(ViewState.ARCHITECTURE)} className={`${currentView === ViewState.ARCHITECTURE ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'} transition-all py-2`}>Theory</button>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentView(ViewState.CART)} className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold size-5 flex items-center justify-center rounded-full border-2 border-background-dark">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-12">
        {currentView === ViewState.CATALOG && (
          <div className="space-y-12 animate-fade-in">
            <section className="relative overflow-hidden rounded-3xl bg-surface-dark border border-border-dark p-12 flex flex-col md:flex-row items-center gap-12">
              <div className="relative z-10 max-w-xl space-y-6 flex-1">
                <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full">SOC Assessment Platform</span>
                <h2 className="text-5xl font-extrabold text-white leading-[1.1]">Unified <span className="text-primary italic">Service</span> Fulfillment Engine</h2>
                <p className="text-lg text-slate-400">Distributor-agnostic gadget procurement powered by real-time API orchestration.</p>
                <div className="flex gap-4">
                  <button onClick={() => document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' })} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-3">
                    Shop Now <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                  <button onClick={() => setCurrentView(ViewState.ARCHITECTURE)} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all">
                    System Design
                  </button>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80" alt="Gadget Setup" className="relative z-10 rounded-2xl border border-border-dark shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500" />
              </div>
            </section>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-primary border-primary text-background-dark' : 'bg-surface-dark border-border-dark text-slate-400 hover:text-white hover:border-primary/50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div id="catalog-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="group bg-surface-dark border border-border-dark rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1">
                  <div className="aspect-[4/3] bg-background-dark relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase">{product.category}</p>
                      <h3 className="text-lg font-bold text-white">{product.name}</h3>
                    </div>
                    <p className="text-sm text-slate-400 h-10 overflow-hidden">{product.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-border-dark">
                      <span className="text-xl font-bold text-white">Rs. {product.basePrice.toLocaleString()}</span>
                      <button onClick={() => addToCart(product)} className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === ViewState.CHECKOUT_PROCESS && (
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 animate-fade-in">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">settings_input_component</span>
                  Orchestrator Console
                </h2>
                <p className="text-slate-400">Simulating live .NET API calls to distributor endpoints.</p>
              </div>
              <QuotationSimulator logs={logs} />

              {isWaitingConfirmation && (
                <div className="bg-surface-dark border border-primary rounded-2xl p-8 animate-fade-in shadow-2xl shadow-primary/10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Quotation Analysis Complete</h3>
                      <p className="text-slate-400">The SOC engine has optimized your procurement route.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase font-bold">Total Potential Savings</p>
                      <p className="text-3xl font-bold text-green-400">Rs. {calculatedSavings.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={confirmOrder} className="flex-1 bg-green-500 hover:bg-green-600 text-background-dark py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">check_circle</span> Confirm & Place Order
                    </button>
                    <button onClick={() => setCurrentView(ViewState.CART)} className="px-8 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 space-y-6">
                <h3 className="font-bold text-white border-b border-border-dark pb-4">Real-time Comparison Matrix</h3>
                <div className="space-y-4">
                  {cart.map((item, idx) => {
                    const finalizedItem = currentOrder?.items.find(i => i.product.id === item.product.id);
                    return (
                      <div key={idx} className="p-4 bg-background-dark/50 rounded-xl border border-border-dark">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm">{item.product.name}</span>
                          <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          {finalizedItem ? (
                            <>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 uppercase">Selected Service</span>
                                <span className="text-xs font-bold text-primary">{finalizedItem.selectedDistributor}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 uppercase">Best Price</span>
                                <p className="text-green-400 font-bold">Rs. {finalizedItem.finalPrice?.toLocaleString()}</p>
                              </div>
                            </>
                          ) : (
                            <div className="w-full flex justify-between items-center animate-pulse">
                              <div className="h-4 w-24 bg-slate-700 rounded"></div>
                              <div className="h-4 w-12 bg-slate-700 rounded"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {currentOrder && (
                  <button onClick={() => setCurrentView(ViewState.ORDERS)} className="w-full bg-green-500 hover:bg-green-600 text-background-dark py-3 rounded-xl font-bold transition-all mt-4">
                    Complete Order & View Invoices
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === ViewState.TESTING && <TestDashboard />}
        {currentView === ViewState.ARCHITECTURE && <ArchitectureView />}

        {currentView === ViewState.ORDERS && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-white">Order History & Fulfillment Logs</h2>
            {orders.map(order => (
              <div key={order.id} className="bg-surface-dark rounded-2xl border border-border-dark overflow-hidden">
                <div className="p-6 bg-background-dark/50 flex justify-between border-b border-border-dark">
                  <div className="flex gap-10">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Transaction ID</p>
                      <p className="font-mono text-sm text-primary">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Date</p>
                      <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Status</p>
                    <span className="text-green-400 text-xs font-bold px-2 py-1 bg-green-400/10 rounded">{order.status}</span>
                  </div>
                </div>
                <div className="p-6">
                  {order.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 py-3 text-sm border-b border-white/5 last:border-0 items-center">
                      <div className="col-span-5 font-medium">
                        {item.product.name} <span className="text-slate-500 text-xs">(x{item.quantity})</span>
                      </div>
                      <div className="col-span-5 text-right text-slate-400 text-xs uppercase tracking-wider">
                        Distributor: <span className="text-slate-300 font-bold ml-1">{item.selectedDistributor}</span>
                      </div>
                      <div className="col-span-2 text-right font-bold text-white">
                        Rs. {((item.finalPrice || 0) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 pt-6 border-t border-border-dark flex justify-between items-center">
                    <button onClick={() => downloadInvoice(order)} className="text-xs text-primary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">download</span> Export JSON Invoice
                    </button>
                    <p className="text-xl font-bold text-white">Total: Rs. {order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === ViewState.CART && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-white">Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="p-20 text-center border-2 border-dashed border-border-dark rounded-3xl">
                <p className="text-slate-500 mb-6">Your shopping cart is empty.</p>
                <button onClick={() => setCurrentView(ViewState.CATALOG)} className="text-primary font-bold">Back to Catalog</button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="bg-surface-dark p-6 rounded-2xl border border-border-dark flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <img src={item.product.image} className="size-16 rounded object-cover" />
                        <div>
                          <h4 className="font-bold">{item.product.name}</h4>
                          <p className="text-xs text-slate-500">Rs. {item.product.basePrice.toLocaleString()} per unit</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))} className="size-8 bg-background-dark rounded border border-border-dark">-</button>
                          <span className="font-bold">{item.quantity}</span>
                          <button onClick={() => setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: i.quantity + 1 } : i))} className="size-8 bg-background-dark rounded border border-border-dark">+</button>
                        </div>
                        <button onClick={() => setCart(prev => prev.filter(i => i.product.id !== item.product.id))} className="text-red-400 hover:text-red-300">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-surface-dark p-8 rounded-2xl border border-border-dark h-fit sticky top-28">
                  <h3 className="font-bold mb-6">Summary</h3>
                  <div className="space-y-4 text-sm mb-8">
                    <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>Rs. {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between font-bold text-lg pt-4 border-t border-border-dark"><span>Total</span><span className="text-primary">Rs. {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                  </div>

                  <div className="bg-background-dark/50 p-4 rounded-xl border border-border-dark mb-6">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-3">Payment Method</p>
                    <div className="flex items-center gap-3 text-sm text-white font-bold">
                      <span className="material-symbols-outlined text-green-400">payments</span>
                      Cash on Delivery (COD)
                      <span className="material-symbols-outlined text-green-400 ml-auto">check_circle</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 px-2">
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    Estimated Delivery: 2-3 Days (Colombo)
                  </div>

                  <button onClick={handleCheckout} className="w-full bg-primary py-4 rounded-xl font-bold shadow-lg shadow-primary/20">Initiate SOC Workflow</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {
        showToast && (
          <div className="fixed bottom-8 right-8 bg-primary text-background-dark font-bold px-6 py-4 rounded-xl shadow-lg shadow-primary/20 animate-fade-in flex items-center gap-3 z-50">
            <span className="material-symbols-outlined">check_circle</span>
            Item added to cart!
          </div>
        )
      }
    </div >
  );

};

export default App;
