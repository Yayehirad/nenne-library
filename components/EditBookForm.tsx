// components/EditBookForm.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditBookForm({ 
  book, 
  genres, 
  locations 
}: { 
  book: any; 
  genres: string[]; 
  locations: string[]; 
}) {
  const supabase = createClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    genre: book.genre || '',
    location: book.location || '',
    status: book.status || 'available',
    description: book.description || '',
    age_group: book.age_group || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('books')
      .update(formData)
      .eq('id', book.id);

    if (error) {
      alert('Error updating book: ' + error.message);
    } else {
      alert('✅ Book updated successfully!');
      router.push('/books');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
        <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Author</label>
        <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Genre</label>
          <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
          <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="borrowed">Borrowed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Age Group</label>
        <Input value={formData.age_group} onChange={(e) => setFormData({ ...formData, age_group: e.target.value })} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}