'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mic, MicOff } from 'lucide-react';
import { useState } from 'react';

interface ControlsPanelProps {
  onVoiceToggle: (isVoiceOn: boolean) => void;
}

export function ControlsPanel({ onVoiceToggle }: ControlsPanelProps) {
  const [isVoiceOn, setIsVoiceOn] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsVoiceOn(checked);
    onVoiceToggle(checked);
  };

  return (
    <div className="flex items-center space-x-2 rounded-lg border bg-card p-4 card-glow">
      {isVoiceOn ? (
        <Mic className="h-6 w-6 text-accent drop-shadow-glow-accent" />
      ) : (
        <MicOff className="h-6 w-6 text-muted-foreground" />
      )}
      <Label htmlFor="voice-toggle" className="text-lg font-medium">
        Voice Output
      </Label>
      <Switch
        id="voice-toggle"
        checked={isVoiceOn}
        onCheckedChange={handleToggle}
        aria-label="Toggle voice output"
      />
    </div>
  );
}
