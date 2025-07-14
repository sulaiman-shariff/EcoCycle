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
import { Bot, Loader2, Send, User, MessageCircle, Sparkles, Zap, Brain, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const chatSchema = z.object({
  question: z.string().min(5, { message: "Question must be at least 5 characters." }),
});

type Message = {
  role: "user" | "assistant";
  content: string;
};

// Helper to render markdown-like AI responses
function renderAIContent(content: string) {
  // Split by lines
  const lines = content.split(/\r?\n/);
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        // Heading (e.g. # Title)
        if (/^#\s+/.test(line)) {
          return <div key={idx} className="font-bold text-base text-blue-700 mt-2">{line.replace(/^#\s+/, '')}</div>;
        }
        // Bullet point (e.g. *, -, or •)
        if (/^(\*|-|•)\s+/.test(line)) {
          // Remove bullet and render the rest with bold support
          const bulletContent = line.replace(/^(\*|-|•)\s+/, '');
          // Replace **bold** with <strong>
          const html = bulletContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          return (
            <div key={idx} className="pl-4 flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span dangerouslySetInnerHTML={{__html: html}} />
            </div>
          );
        }
        // Bold (e.g. **text**)
        if (/\*\*(.*?)\*\*/.test(line)) {
          return <div key={idx} dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />;
        }
        // Plain text
        return <div key={idx}>{line}</div>;
      })}
    </div>
  );
}

export function AiChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm your EcoCycle AI assistant, specialised for India 🇮🇳. I can help you with all things e-waste, recycling, and sustainability in India. Ask me anything about Indian e-waste rules, CPCB/MoEFCC guidelines, or how to recycle electronics in your city!" 
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

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
    form.setValue('question', ''); // Clear input immediately

    // Always send Indian context to the AI model
    const response = await askAiAction({ question: values.question });

    if (response.error) {
      setError(response.error);
      const errorMessage: Message = { role: "assistant", content: "Sorry, I encountered an error. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } else if (response.result) {
      const assistantMessage: Message = { role: "assistant", content: response.result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const suggestedQuestions = [
    "How do I dispose of old batteries?",
    "What's the environmental impact of smartphones?",
    "Where can I recycle electronics near me?",
    "How to reduce e-waste at home?",
    "What materials can be recovered from electronics?",
    "Is it better to repair or replace my device?"
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Assistant
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">Your expert guide for e-waste and sustainability</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            Instant Answers
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Lightbulb className="w-3 h-3 mr-1" />
            Expert Knowledge
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Sparkles className="w-3 h-3 mr-1" />
            24/7 Available
          </Badge>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Chat with AI Assistant
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Ask me anything about e-waste, recycling, sustainability, or environmental impact
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[400px] sm:h-[500px]">
          <ScrollArea className="flex-grow pr-4 -mr-4" ref={scrollAreaRef}>
            <div className="space-y-4 sm:space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 sm:gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                    message.role === "user" && "justify-end"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-blue-200">
                      <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white'>
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    "max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm shadow-sm",
                    message.role === 'assistant' 
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200' 
                      : 'bg-gradient-to-br from-green-500 to-blue-600 text-white'
                  )}>
                    {message.role === 'assistant' ? renderAIContent(message.content) : <p className="leading-relaxed">{message.content}</p>}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-green-200">
                      <AvatarFallback className='bg-gradient-to-br from-green-500 to-blue-600 text-white'>
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-3 sm:gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-blue-200">
                    <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white'>
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-blue-600" />
                      <span className="text-xs sm:text-sm text-blue-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>
          </ScrollArea>
          
          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Try asking about:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      form.setValue('question', question);
                      form.handleSubmit(onSubmit)();
                    }}
                    className="text-left p-2 sm:p-3 text-xs sm:text-sm bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Form */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Textarea
                          placeholder="Ask me anything about e-waste, recycling, or sustainability..."
                          className="resize-none min-h-[50px] sm:min-h-[60px] bg-white border-2 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-lg sm:rounded-xl text-xs sm:text-sm"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                             if(form.getValues('question').trim().length >= 5) {
                               form.handleSubmit(onSubmit)();
                             }
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-xs" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={loading} 
                  size="icon" 
                  className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTitle className="text-red-800 text-sm">Chat Error</AlertTitle>
          <AlertDescription className="text-red-700 text-xs sm:text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
