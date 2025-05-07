
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contentService } from '@/services/contentService';
import { ContentItem, ContentFilter } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ContentFilter>({
    search: '',
    length: 'all',
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await contentService.getAllContent();
        setContentItems(data);
        setFilteredItems(data);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to fetch content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...contentItems];

    // Filter by length
    if (filter.length !== 'all') {
      result = result.filter((item) => item.summary_length === filter.length);
    }

    // Filter by search term
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.auto_title.toLowerCase().includes(searchTerm) ||
          (Array.isArray(item.keywords)
            ? item.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm))
            : typeof item.keywords === 'string' && item.keywords.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredItems(result);
  }, [filter, contentItems]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const handleLengthChange = (value: string) => {
    setFilter({ ...filter, length: value as ContentFilter['length'] });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" className="border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Your Content</h1>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or keywords..."
            value={filter.search}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Select value={filter.length} onValueChange={handleLengthChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Summary length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lengths</SelectItem>
            <SelectItem value="short">Short</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="long">Long</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content grid */}
      {filteredItems.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-2xl bg-muted/40 p-6 text-center">
          <p className="mb-2 text-xl font-medium">No content found</p>
          <p className="mb-6 text-muted-foreground">
            {filter.search || filter.length !== 'all'
              ? 'Try changing your search filters'
              : 'Create your first content to get started'}
          </p>
          <Button onClick={() => navigate('/create')}>Create Content</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card
                  className="h-full cursor-pointer overflow-hidden rounded-2xl transition-shadow hover:shadow-md"
                  onClick={() => navigate(`/content/${item.id}`)}
                >
                  <CardContent className="flex h-full flex-col p-4">
                    <div className="flex-1 space-y-3 p-2">
                      <div className="flex items-start justify-between">
                        <Badge
                          variant={
                            item.summary_length === 'short'
                              ? 'default'
                              : item.summary_length === 'medium'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="mb-2"
                        >
                          {item.summary_length}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <h3 className="text-xl font-semibold">{item.auto_title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(item.keywords) 
                          ? (
                            <>
                              {item.keywords.slice(0, 3).map((keyword, index) => (
                                <Badge variant="outline" key={index}>
                                  {keyword}
                                </Badge>
                              ))}
                              {item.keywords.length > 3 && (
                                <Badge variant="outline">+{item.keywords.length - 3}</Badge>
                              )}
                            </>
                          ) 
                          : (
                            <Badge variant="outline">
                              {typeof item.keywords === 'string' ? item.keywords : 'No keywords'}
                            </Badge>
                          )
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
