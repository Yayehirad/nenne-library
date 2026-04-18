// app/(main)/my-requests/MyRequestsClient.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function MyRequestsClient({ 
  requests, 
  isFamily 
}: { 
  requests: any[]; 
  isFamily: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();

  const updateStatus = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    if (!confirm(`Mark this request as ${newStatus}?`)) return;

    const { error } = await supabase
      .from('borrow_requests')
      .update({ status: newStatus })
      .eq('id', requestId);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert(`Request ${newStatus} successfully!`);
      router.refresh();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left py-5 px-8 font-medium text-gray-600">Book</th>
            <th className="text-left py-5 px-8 font-medium text-gray-600">Requested by</th>
            <th className="text-left py-5 px-8 font-medium text-gray-600">Date</th>
            <th className="text-left py-5 px-8 font-medium text-gray-600">Status</th>
            {isFamily && <th className="text-right py-5 px-8 font-medium text-gray-600">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-gray-400">
                No borrow requests yet
              </td>
            </tr>
          ) : (
            requests.map((req: any) => (
              <tr key={req.id} className="border-b last:border-none hover:bg-gray-50">
                <td className="py-5 px-8 font-medium">{req.books?.title}</td>
                <td className="py-5 px-8 text-gray-700">
                  {req.users?.name || req.users?.email || 'Unknown'}
                </td>
                <td className="py-5 px-8 text-gray-500 text-sm">
                  {new Date(req.created_at).toLocaleDateString()}
                </td>
                <td className="py-5 px-8">
                  <span className={`inline-block px-4 py-1 text-xs font-medium rounded-full ${
                    req.status === 'approved' ? 'bg-green-100 text-green-700' :
                    req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {req.status === 'approved' ? 'Approved' :
                     req.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>
                </td>
                {isFamily && req.status === 'pending' && (
                  <td className="py-5 px-8 text-right space-x-2">
                    <button
                      onClick={() => updateStatus(req.id, 'approved')}
                      className="px-5 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-2xl transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, 'rejected')}
                      className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-2xl transition"
                    >
                      Reject
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}