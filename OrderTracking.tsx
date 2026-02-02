import React, { useState } from 'react';

const mockFetchOrderTracking = async (orderId: string) => {
  await new Promise((r) => setTimeout(r, 1000));
  if (orderId === '12345') {
    return {
      success: true,
      data: {
        orderId: '12345',
        status: 'Shipped',
        timeline: [
          { status: 'Placed', timestamp: '2026-02-01 10:00' },
          { status: 'Processing', timestamp: '2026-02-01 12:00' },
          { status: 'Shipped', timestamp: '2026-02-02 09:00' },
        ],
      },
    };
  } else if (orderId === '54321') {
    return {
      success: true,
      data: {
        orderId: '54321',
        status: 'Delivered',
        timeline: [
          { status: 'Placed', timestamp: '2026-01-28 08:00' },
          { status: 'Processing', timestamp: '2026-01-28 10:00' },
          { status: 'Shipped', timestamp: '2026-01-29 14:00' },
          { status: 'Delivered', timestamp: '2026-01-30 16:00' },
        ],
      },
    };
  } else {
    return { success: false, error: 'Order not found.' };
  }
};

interface TimelineItem {
  status: string;
  timestamp: string;
}

interface OrderTrackingData {
  orderId: string;
  status: string;
  timeline: TimelineItem[];
}

const OrderTrackingTimeline: React.FC<{ timeline: TimelineItem[]; currentStatus: string }> = ({ timeline, currentStatus }) => (
  <ol className="relative border-l border-indigo-300 ml-4 mt-6">
    {timeline.map((item, idx) => (
      <li key={item.status} className="mb-8 ml-6">
        <span
          className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full border-2 ${
            item.status === currentStatus
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white border-indigo-300 text-indigo-600'
          }`}
        >
          {idx + 1}
        </span>
        <div className="flex flex-col">
          <span className={`font-bold ${item.status === currentStatus ? 'text-indigo-700' : 'text-slate-700'}`}>{item.status}</span>
          <span className="text-xs text-slate-500 mt-1">{item.timestamp}</span>
        </div>
      </li>
    ))}
  </ol>
);

const OrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTracking(null);
    const res = await mockFetchOrderTracking(orderId.trim());
    setLoading(false);
    if (res.success) {
      setTracking(res.data);
    } else {
      setError(res.error || 'Unable to fetch order details.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white/90 rounded-2xl shadow-lg p-8 mt-12 border border-slate-200">
      <h2 className="text-2xl font-black text-indigo-700 mb-6 text-center">Track Your Order</h2>
      <form onSubmit={handleTrack} className="flex gap-2 mb-4">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="flex-1 px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-lg"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow"
          disabled={loading}
        >
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </form>
      {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-center">{error}</div>}
      {tracking && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-slate-700">Order ID:</span>
            <span className="text-indigo-700 font-mono">{tracking.orderId}</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold text-slate-700">Current Status:</span>
            <span className="text-indigo-700 font-bold">{tracking.status}</span>
          </div>
          <OrderTrackingTimeline timeline={tracking.timeline} currentStatus={tracking.status} />
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
