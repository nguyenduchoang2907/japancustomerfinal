import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import chatbotResponseApi from '@/api/chatbotResponseApi';
import { ChatbotResponse } from '@/types/chatbotResponse';

type Message = {
  id: number;
  text: string;
  isBot: boolean;
  confidence?: number;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Xin chào nhà hàng Tokime xin kính chào quý khác. Tôi có thể giúp gì quý khách không？",
    isBot: true,
  },
];

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: b.length + 1 }, (_, i) =>
    Array(a.length + 1).fill(0)
  );

  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
    }
  }

  return matrix[b.length][a.length];
}

function calculateConfidence(input: string, keyword: string): number {
  const distance = levenshteinDistance(input.toLowerCase(), keyword.toLowerCase());
  const maxLen = Math.max(input.length, keyword.length);
  const similarity = 1 - distance / maxLen;
  return Math.round(similarity * 100) / 100;
}

const ChatBot = ({ responses }: { responses: ChatbotResponse[] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await chatbotResponseApi.handleQuery(input);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: res.data.reply,
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // fallback with keyword matching
      let bestMatch: ChatbotResponse | undefined;
      let highestConfidence = 0;

      for (const r of responses) {
        const confidence = calculateConfidence(input, r.keyword);
        if (confidence > highestConfidence) {
          highestConfidence = confidence;
          bestMatch = r;
        }
      }

      const fallbackText =
        highestConfidence >= 0.5 && bestMatch
          ? bestMatch.response
          : "申し訳ありませんが、現在そのご質問には対応していません。";

      const fallbackMessage: Message = {
        id: Date.now() + 2,
        text: fallbackText,
        isBot: true,
        confidence: highestConfidence,
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button className="rounded-full h-16 w-16 shadow-lg bg-gradient-to-r from-japanese-sakura to-japanese-matcha group relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            <MessageCircle size={28} className="relative z-10 group-hover:animate-pulse" />
            <Sparkles size={16} className="absolute top-2 right-2 text-yellow-300 animate-pulse" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[70vh] max-w-md mx-auto japanese-card">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <div className="relative">
                <MessageCircle size={20} className="text-japanese-sakura animate-pulse" />
                <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-500 animate-spin" />
              </div>
              <span className="japanese-title">桜アシスタント</span>
            </DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 hover:bg-japanese-sakura/20"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
          </DrawerHeader>

          <div className="flex flex-col flex-1 px-4 overflow-y-auto h-[calc(70vh-140px)] pb-28">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] mb-4 p-3 rounded-lg ${
                  msg.isBot
                    ? 'bg-gradient-to-r from-japanese-sakura/20 to-japanese-matcha/20 text-japanese-sumi self-start rounded-tl-none border border-japanese-sakura/30'
                    : 'bg-gradient-to-r from-japanese-sumi to-japanese-matcha text-white self-end rounded-br-none shadow-lg'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="max-w-[80%] mb-4 p-4 bg-gradient-to-r from-japanese-sakura/20 to-japanese-matcha/20 text-japanese-sumi self-start rounded-lg rounded-tl-none border border-japanese-sakura/30">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-japanese-sakura animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-japanese-matcha animate-bounce delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-japanese-sumi animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <DrawerFooter className="absolute bottom-0 left-0 right-0 bg-japanese-washi border-t border-japanese-sakura/30">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Bạn có thắc mắc gì không?"
                className="resize-none japanese-text border-japanese-sakura/30 focus:border-japanese-sakura"
                rows={1}
              />
              <Button
                onClick={handleSend}
                className="h-full zen-button bg-gradient-to-r from-japanese-sakura to-japanese-matcha"
              >
                <Send size={18} className="relative z-10" />
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ChatBot;
