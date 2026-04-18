// app/(main)/lending/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function LendingPage() {
  const supabase = await createClient();

  const { data: lending } = await supabase
    .from('borrow_requests')
    .select(`
      id,
      status,
      created_at,
      books (title, author),
      users (name, email)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Lending</h1>
      <p className="text-gray-600 mb-8">Currently borrowed books</p>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-5 px-8 font-medium text-gray-600">Book</th>
              <th className="text-left py-5 px-8 font-medium text-gray-600">Borrowed by</th>
              <th className="text-left py-5 px-8 font-medium text-gray-600">Date</th>
              <th className="text-left py-5 px-8 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {lending && lending.length > 0 ? (
              lending.map((item: any) => (
                <tr key={item.id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-5 px-8 font-medium">
                    {item.books?.title}
                  </td>
                  <td className="py-5 px-8 text-gray-700">
                    {item.users?.name || item.users?.email || 'Unknown'}
                  </td>
                  <td className="py-5 px-8 text-gray-500 text-sm">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-5 px-8">
                    <span className="inline-block px-4 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                      Borrowed
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  No books currently borrowed
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}