'use client';

import { ControlsPanel } from "@/components/app/controls-panel";
import { FeatureTabs } from "@/components/app/feature-tabs";
import { VideoFeed } from "@/components/app/video-feed";
import { useState, useCallback } from "react";

export default function AppPage() {
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [spokenWords, setSpokenWords] = useState<string>("Welcome to Talking Hands!");
  const [isVoiceOn, setIsVoiceOn] = useState(false);

  const handleNewTranslation = useCallback((text: string) => {
    if (text && text.trim() !== '') {
      setConversationHistory(prev => {
        // Avoid adding duplicate consecutive messages
        if (prev.length > 0 && prev[prev.length - 1] === text) {
          return prev;
        }
        return [...prev, text];
      });

      if (isVoiceOn) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
      }
    }
  }, [isVoiceOn]);

  const handleVoiceToggle = (isVoiceEnabled: boolean) => {
    setIsVoiceOn(isVoiceEnabled);
  };

  // Simulate spoken words from other participants
  useEffect(() => {
    const words = [
      "Hello everyone, can you hear me?",
      "Yes, loud and clear!",
      "Great, let's get started.",
      "I'll share my screen now.",
      "Does anyone have any questions?",
      "That's a great point.",
      "Let's circle back to that later.",
      "Thanks for the productive meeting!",
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % words.length;
      setSpokenWords(words[index]);
    }, 10000); // Change words every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 h-full">
        {/* Main Content: Video Feed and Controls */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-[calc(100vh-12rem)]">
          <VideoFeed onNewTranslation={handleNewTranslation} spokenWords={spokenWords} />
          <ControlsPanel onVoiceToggle={handleVoiceToggle} />
        </div>

        {/* Sidebar: Feature Tabs */}
        <div className="lg:col-span-1 mt-8 lg:mt-0 h-[calc(100vh-12rem)]">
          <FeatureTabs conversationHistory={conversationHistory} />
        </div>
      </div>
      <canvas ref={useRef<HTMLCanvasElement>(null)} className="hidden"></canvas>
    </div>
  );
}
