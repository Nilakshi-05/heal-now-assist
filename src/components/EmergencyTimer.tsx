import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone } from 'lucide-react';

interface EmergencyTimerProps {
  onEmergencyCall: () => void;
  onDismiss: () => void;
}

export const EmergencyTimer: React.FC<EmergencyTimerProps> = ({ onEmergencyCall, onDismiss }) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          onEmergencyCall();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onEmergencyCall]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((180 - timeLeft) / 180) * 100;

  const handleDismiss = () => {
    setIsActive(false);
    onDismiss();
  };

  if (!isActive) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-emergency border-emergency/20 z-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-emergency">
          <AlertTriangle className="w-5 h-5" />
          <span>Emergency Auto-Call</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-emergency">{formatTime(timeLeft)}</div>
          <p className="text-sm text-muted-foreground">
            Auto-calling emergency services if no action taken
          </p>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-emergency h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex space-x-2">
          <Button
            variant="emergency"
            size="sm"
            onClick={onEmergencyCall}
            className="flex-1"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="flex-1"
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};