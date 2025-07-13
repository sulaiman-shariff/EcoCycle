"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type AnswerEWasteQuestionsOutput } from '@/ai/flows/answer-e-waste-questions';
import { askAiAction } from '@/app/actions';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const chatSchema = z.object({
  question: z.string().min(5, { message: "Question must be at least 5 characters." }),
});

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AiChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm the EcoVision AI assistant. Ask me anything about e-waste, recycling, or sustainability." },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      question: "",
    },
  });

  async function onSubmit(values: z.infer<typeof chatSchema>) {
    setLoading(true);
    setError(null);
    const userMessage: Message = { role: "user", content: values.question };
    setMessages((prev) => [...prev, userMessage]);

    const response = await askAiAction({ question: values.question });

    if (response.error) {
      setError(response.error);
      const errorMessage: Message = { role: "assistant", content: "Sorry, I encountered an error. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } else if (response.result) {
      const assistantMessage: Message = { role: "assistant", content: response.result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    }

    form.reset();
    setLoading(false);
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">E-Waste AI Chatbot</CardTitle>
        <CardDescription>Get smart guidance on e-waste, recycling, and best practices.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[60vh]">
        <ScrollArea className="flex-grow pr-4 -mr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" && "justify-end"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className='bg-primary text-primary-foreground'><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-lg p-3 text-sm",
                  message.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                )}>
                  <p>{message.content}</p>
                </div>
                 {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className='bg-accent text-accent-foreground'><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {loading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className='bg-primary text-primary-foreground'><Bot className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="mt-4 pt-4 border-t">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Textarea
                        placeholder="e.g., How do I dispose of old batteries?"
                        className="resize-none"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if(form.formState.isValid) {
                              form.handleSubmit(onSubmit)();
                            }
                          }
                        }}
                      />
                    </FormControl>
                     <FormMessage className="mt-1" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} size="icon" className="h-full px-4 aspect-square">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
