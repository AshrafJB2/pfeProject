
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { contentService } from '@/services/contentService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Upload } from 'lucide-react';

const createContentSchema = z.object({
  original_text: z.string().optional(),
  summary_length: z.enum(['short', 'medium', 'long']),
});

type CreateContentFormValues = z.infer<typeof createContentSchema>;

export default function CreateContentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateContentFormValues>({
    resolver: zodResolver(createContentSchema),
    defaultValues: {
      original_text: '',
      summary_length: 'medium',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (data: CreateContentFormValues) => {
    setIsSubmitting(true);
    setProgress(0);
    
    const intervalId = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 500);
    
    try {
      if (tabValue === 'file' && selectedFile) {
        // File upload submission
        const response = await contentService.createContent({
          original_file: selectedFile,
          summary_length: data.summary_length,
        });
        
        toast({
          title: "Content created successfully",
          description: "Your content has been processed and is ready.",
        });
        
        navigate(`/content/${response.id}`);
      } else if (tabValue === 'text' && data.original_text) {
        // Text submission
        const response = await contentService.createContent({
          original_text: data.original_text,
          summary_length: data.summary_length,
        });
        
        toast({
          title: "Content created successfully",
          description: "Your content has been processed and is ready.",
        });
        
        navigate(`/content/${response.id}`);
      } else {
        throw new Error('Please provide either text or a file');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      toast({
        title: "Failed to create content",
        description: "There was an error processing your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(intervalId);
      setProgress(0);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Create New Content</h1>
      
      <Card className="overflow-hidden rounded-2xl">
        <CardHeader>
          <CardTitle>New Content</CardTitle>
          <CardDescription>
            Upload a file or paste text to generate a summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="file" className="gap-2">
                    <Upload className="h-4 w-4" />
                    <span>File Upload</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="original_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Text</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your content here..."
                            rows={10}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="file" className="space-y-4 pt-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".txt,.docx,.pdf"
                    />
                    
                    {selectedFile ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                      >
                        <p className="mb-2 text-lg font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                        <Button
                          variant="outline"
                          onClick={triggerFileInput}
                          className="mt-4"
                          type="button"
                        >
                          Change File
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          Drag and drop or click to upload
                        </p>
                        <p className="mb-4 text-xs text-muted-foreground">
                          Supports TXT, DOCX, PDF (max 10MB)
                        </p>
                        <Button
                          variant="outline"
                          onClick={triggerFileInput}
                          type="button"
                        >
                          Select File
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <FormField
                control={form.control}
                name="summary_length"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Summary Length</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col gap-2 sm:flex-row"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="short" />
                          </FormControl>
                          <FormLabel className="font-normal">Short</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">Medium</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="long" />
                          </FormControl>
                          <FormLabel className="font-normal">Long</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSubmitting && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2 w-full" />
                  <p className="text-center text-sm text-muted-foreground">
                    Processing your content...
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" className="border-white" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Create Content'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
