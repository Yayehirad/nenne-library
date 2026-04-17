// app/(main)/reading-log/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Star } from 'lucide-react';

export default async function ReadingLogPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from('reading_log')
    .select(`
      *,
      books (title, author)
    `)
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Reading Log</h1>

      <div className="space-y-6">
        {logs?.map((log: any) => (
          <div key={log.id} className="bg-white border rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{log.books?.title}</h3>
                <p className="text-gray-600">{log.books?.author}</p>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    fill={i < log.rating ? "currentColor" : "none"} 
                  />
                ))}
                <span className="ml-2 text-gray-700 font-medium">{log.rating}/5</span>
              </div>
            </div>

            {log.notes && (
              <p className="mt-4 text-gray-700 italic">"{log.notes}"</p>
            )}

            <p className="text-xs text-gray-500 mt-6">
              {new Date(log.created_at).toLocaleDateString('en-AU')}
            </p>
          </div>
        ))}

        {(!logs || logs.length === 0) && (
          <p className="text-center text-gray-500 py-12">No reading logs yet.</p>
        )}
      </div>
    </div>
  );
}