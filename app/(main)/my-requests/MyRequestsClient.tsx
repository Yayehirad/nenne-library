'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function MyRequestsClient({ requests, isFamily }: { requests: any[]; isFamily: boolean }) {
  const supabase = createClient();
  const router = useRouter();

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (!confirm(`Mark as ${status}?`)) return;

    const { error } = await supabase.from('borrow_requests').update({ status }).eq('id', id);
    if (error) alert(error.message);
    else router.refresh();
  };

  const cancelRequest = async (id: string) => {
    if (!confirm('Cancel request?')) return;

    const { error } = await supabase.from('borrow_requests').delete().eq('id', id);
    if (error) alert(error.message);
    else router.refresh();
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left py-5 px-8">Book</th>
            <th className="text-left py-5 px-8">Requested by</th>
            <th className="text-left py-5 px-8">Date</th>
            <th className="text-left py-5 px-8">Status</th>
            <th className="text-right py-5 px-8">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="py-5 px-8 font-medium">{r.books?.title}</td>
              <td className="py-5 px-8">{r.requester_name || r.requester_email}</td>
              <td className="py-5 px-8 text-gray-500">
                {r.request_date ? new Date(r.request_date).toLocaleDateString('en-AU') : '—'}
              </td>
              <td className="py-5 px-8">
                <span className={`px-4 py-1 text-xs rounded-full ${
                  r.status === 'approved' ? 'bg-green-100 text-green-700' :
                  r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {r.status}
                </span>
              </td>
              <td className="py-5 px-8 text-right">
                {r.status === 'pending' && (
                  isFamily ? (
                    <>
                      <button onClick={() => updateStatus(r.id, 'approved')} className="px-4 py-1 text-sm bg-green-600 text-white rounded-xl mr-2">Approve</button>
                      <button onClick={() => updateStatus(r.id, 'rejected')} className="px-4 py-1 text-sm bg-red-600 text-white rounded-xl">Reject</button>
                    </>
                  ) : (
                    <button onClick={() => cancelRequest(r.id)} className="px-4 py-1 text-sm bg-gray-600 text-white rounded-xl">Cancel</button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}