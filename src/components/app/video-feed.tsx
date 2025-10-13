'use client';

import { translateSignLanguage } from '@/ai/flows/real-time-sign-language-translation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Camera, Heart, Mic, Smile, ThumbsUp, Video, VideoOff } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type FC } from 'react';

type EmojiReaction = {
  id: number;
  emoji: string;
  x: number;
};

interface VideoFeedProps {
  onNewTranslation: (text: string) => void;
  spokenWords: string;
}

export const VideoFeed: FC<VideoFeedProps> = ({ onNewTranslation, spokenWords }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState('');
  const { toast } = useToast();
  const [reactions, setReactions] = useState<EmojiReaction[]>([]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        variant: 'destructive',
        title: 'Camera Error',
        description: 'Could not access the camera. Please check permissions and try again.',
      });
      setIsCameraOn(false);
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
      setIsTranslating(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isCameraOn) {
      setIsTranslating(true);
      intervalId = setInterval(async () => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataUri = canvas.toDataURL('image/jpeg');
            try {
              const result = await translateSignLanguage({ imageDataUri });
              if (result.detectedText) {
                setCurrentTranslation(result.detectedText);
                onNewTranslation(result.detectedText);
              }
            } catch (error) {
              console.error('Translation error:', error);
              // Silently fail to avoid spamming user with toasts
            }
          }
        }
      }, 2000); // Translate every 2 seconds
    } else {
        setIsTranslating(false);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      setIsTranslating(false)
    };
  }, [isCameraOn, onNewTranslation]);

  const addReaction = (emoji: string) => {
    setReactions(prev => [
      ...prev,
      { id: Date.now(), emoji, x: Math.random() * 80 + 10 },
    ]);
  };

  useEffect(() => {
    if (reactions.length > 0) {
      const timer = setTimeout(() => {
        setReactions(prev => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [reactions]);

  return (
    <Card className="flex flex-col h-full bg-card/50 overflow-hidden card-glow">
      <div className="relative flex-1 flex items-center justify-center bg-black/80 rounded-t-lg">
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        
        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-card-foreground gap-4">
            <Camera className="h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-medium">Camera is off</p>
            <Button onClick={startCamera}>Turn on Camera</Button>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-2xl font-bold text-glow transition-opacity duration-500"
               key={spokenWords}>
                {spokenWords}
            </p>
        </div>

        <div className="absolute top-4 right-4">
            <div className={cn("flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white transition-opacity", isTranslating ? 'opacity-100' : 'opacity-0')}>
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
                Translating...
            </div>
        </div>

        {/* Emoji Reactions */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {reactions.map(r => (
            <div
              key={r.id}
              className="absolute bottom-0 animate-float-up text-4xl"
              style={{ left: `${r.x}%` }}
            >
              {r.emoji}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-4 border-t bg-background">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Detected Word:</p>
          <p className="text-lg font-semibold truncate text-primary-foreground drop-shadow-glow-primary">
            {isTranslating ? currentTranslation || '...' : 'Translation paused'}
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => addReaction('👍')} aria-label="Send Thumbs Up">
              <ThumbsUp className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => addReaction('❤️')} aria-label="Send Heart">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => addReaction('😊')} aria-label="Send Smile">
              <Smile className="h-5 w-5" />
            </Button>
            <Button 
              variant={isCameraOn ? 'destructive' : 'secondary'} 
              size="icon" 
              onClick={isCameraOn ? stopCamera : startCamera}
              aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
        </div>
      </div>
    </Card>
  );
};
