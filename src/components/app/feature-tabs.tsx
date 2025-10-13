'use client';

import { summarizeConversation } from '@/ai/flows/summarize-conversation-with-ai-assistant';
import { generateSignGestures } from '@/ai/flows/generate-sign-gestures-from-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Hand, Languages, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface FeatureTabsProps {
  conversationHistory: string[];
}

const textToSignSchema = z.object({
  text: z.string().min(1, 'Please enter some text to translate.'),
});

const AIAssistantSchema = z.object({
  customPrompt: z.string().optional(),
});

export function FeatureTabs({ conversationHistory }: FeatureTabsProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);

  const textToSignForm = useForm<z.infer<typeof textToSignSchema>>({
    resolver: zodResolver(textToSignSchema),
    defaultValues: { text: '' },
  });

  const aiAssistantForm = useForm<z.infer<typeof AIAssistantSchema>>({
    resolver: zodResolver(AIAssistantSchema),
    defaultValues: { customPrompt: '' },
  });

  async function onTextToSignSubmit(values: z.infer<typeof textToSignSchema>) {
    setIsGenerating(true);
    setGeneratedVideo(null);
    setOpenVideoDialog(true);
    try {
      const result = await generateSignGestures({ spokenWords: values.text });
      if(result.signLanguageVideoDataUri) {
        setGeneratedVideo(result.signLanguageVideoDataUri);
      } else {
        setOpenVideoDialog(false);
        toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: 'Could not generate sign gesture video. The AI may not support the requested text.',
        });
      }
    } catch (error) {
      console.error('Error generating sign gestures:', error);
      setOpenVideoDialog(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while generating the sign gesture video.',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSummarize() {
    if (conversationHistory.length === 0) {
      toast({
        title: 'Nothing to summarize',
        description: 'The conversation is empty.',
      });
      return;
    }
    setIsSummarizing(true);
    setSummary(null);
    try {
        const conversationText = conversationHistory.join('\n');
        const result = await summarizeConversation({ conversationText });
        setSummary(result.summary);
    } catch (error) {
        console.error('Error summarizing conversation:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to summarize the conversation.',
        });
    } finally {
        setIsSummarizing(false);
    }
  }

  return (
    <Card className="h-full flex flex-col card-glow">
      <Tabs defaultValue="translation" className="flex-1 flex flex-col">
        <TabsList className="m-4 grid w-[calc(100%-2rem)] grid-cols-3">
          <TabsTrigger value="translation"><Languages className="mr-2 h-4 w-4"/>Transcript</TabsTrigger>
          <TabsTrigger value="text-to-sign"><Hand className="mr-2 h-4 w-4"/>Text to Sign</TabsTrigger>
          <TabsTrigger value="ai-assistant"><Bot className="mr-2 h-4 w-4"/>Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="translation" className="flex-1 flex flex-col m-0 mt-0 p-4 pt-0">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Conversation Transcript</CardTitle>
            <CardDescription>A log of all translated text from the session.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-full rounded-md border p-4">
              {conversationHistory.length > 0 ? (
                conversationHistory.map((text, index) => (
                  <p key={index} className="mb-2 last:mb-0">{text}</p>
                ))
              ) : (
                <p className="text-muted-foreground">No translations yet.</p>
              )}
            </ScrollArea>
          </CardContent>
        </TabsContent>

        <TabsContent value="text-to-sign" className="flex-1 flex flex-col m-0 mt-0 p-4 pt-0">
           <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Text to Sign Generator</CardTitle>
              <CardDescription>Convert spoken words into a sign language video animation.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Form {...textToSignForm}>
                <form onSubmit={textToSignForm.handleSubmit(onTextToSignSubmit)} className="space-y-4">
                  <FormField
                    control={textToSignForm.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Text to translate</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Hello, how are you?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Dialog open={openVideoDialog} onOpenChange={setOpenVideoDialog}>
                    <DialogTrigger asChild>
                      <Button type="submit" disabled={isGenerating} className="w-full button-glow">
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isGenerating ? 'Generating...' : 'Generate Gesture'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generated Sign Gesture</DialogTitle>
                            { !isGenerating && generatedVideo && (
                            <DialogDescription>
                                Animation for: &quot;{textToSignForm.getValues('text')}&quot;
                            </DialogDescription>
                            )}
                        </DialogHeader>
                        <div className="relative aspect-square w-full mx-auto">
                            {isGenerating && !generatedVideo && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-muted-foreground">Generating video, this may take a moment...</p>
                              </div>
                            )}
                            {generatedVideo && (
                              <video src={generatedVideo} controls autoPlay loop className="w-full h-full object-contain rounded-md" />
                            )}
                        </div>
                    </DialogContent>
                  </Dialog>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-assistant" className="flex-1 flex flex-col m-0 mt-0 p-4 pt-0">
           <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>AI Assistant</CardTitle>
                    <CardDescription>Your smart helper for this conversation.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button onClick={onSummarize} disabled={isSummarizing || conversationHistory.length === 0} className="w-full button-glow">
                                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                                Summarize Conversation
                            </Button>
                        </DialogTrigger>
                        {summary && (
                             <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                    <DialogTitle>Conversation Summary</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="max-h-[60vh] rounded-md p-4">
                                  <p className="whitespace-pre-wrap">{summary}</p>
                                </ScrollArea>
                            </DialogContent>
                        )}
                    </Dialog>
                    <p className="text-center text-sm text-muted-foreground">More AI features coming soon!</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
