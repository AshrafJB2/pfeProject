
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { contentService } from '@/services/contentService';
import { ContentItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Download, Edit, ChevronDown, ChevronUp } from 'lucide-react';

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOriginalExpanded, setIsOriginalExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      
      try {
        const data = await contentService.getContentById(Number(id));
        setContent(data);
      } catch (err) {
        console.error('Error fetching content details:', err);
        setError('Failed to fetch content details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  const handleDownload = async (format: 'docx' | 'pdf' | 'txt') => {
    if (!id || !content) return;
    
    setIsDownloading(true);
    
    try {
      const blob = await contentService.downloadContent(Number(id), format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.auto_title}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download successful",
        description: `${content.auto_title}.${format} has been downloaded.`,
      });
    } catch (err) {
      console.error('Error downloading content:', err);
      toast({
        title: "Download failed",
        description: "There was a problem downloading the file.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };



  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" className="border-primary" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <p className="text-destructive">{error || 'Content not found'}</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/')}
      >
        &larr; Back
      </Button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header section */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Badge className="mb-2">{content.summary_length}</Badge>
            <h1 className="text-3xl font-bold">{content.auto_title}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(content.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-2">
            {/* Download buttons */}
            <Button
              variant="secondary"
              onClick={() => handleDownload('txt')}
              disabled={isDownloading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span>TXT</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleDownload('docx')}
              disabled={isDownloading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span>DOCX</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </Button>
          </div>
        </div>
        
        {/* Keywords */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(content.keywords) 
              ? content.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    {keyword}
                  </Badge>
                ))
              : typeof content.keywords === 'string' 
                ? content.keywords.split(',').map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword.trim()}
                    </Badge>
                  ))
                : (
                    <Badge variant="outline">No keywords</Badge>
                  )
            }
          </div>
        </div>
        
        {/* Summary */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Summary</h2>
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap">{content.summary}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Original Text */}
        <div>
          <Collapsible
            open={isOriginalExpanded}
            onOpenChange={setIsOriginalExpanded}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Original Text</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span>{isOriginalExpanded ? 'Hide' : 'Show'}</span>
                  {isOriginalExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <AnimatePresence>
              {isOriginalExpanded && (
                <CollapsibleContent forceMount>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="rounded-2xl">
                      <CardContent className="p-6">
                        <p className="whitespace-pre-wrap">{content.original_text}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        </div>
      </motion.div>
    </div>
  );
}
