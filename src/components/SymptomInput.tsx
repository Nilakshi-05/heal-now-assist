import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Send } from 'lucide-react';

interface SymptomInputProps {
  onSubmit: (symptoms: string) => void;
}

export const SymptomInput: React.FC<SymptomInputProps> = ({ onSubmit }) => {
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setSymptoms(prev => prev + (prev ? ' ' : '') + "I have been experiencing headaches and fever for the past two days");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleSubmit = () => {
    if (symptoms.trim()) {
      onSubmit(symptoms);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medical">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          Describe Your Symptoms
        </CardTitle>
        <p className="text-muted-foreground">
          Tell us what you're experiencing. You can type or use voice input.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Describe your symptoms in detail..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-32 pr-12 transition-medical focus:shadow-medical"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleVoiceInput}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-emergency animate-pulse" />
            ) : (
              <Mic className="w-4 h-4 text-primary" />
            )}
          </Button>
        </div>
        
        {isListening && (
          <div className="flex items-center justify-center space-x-2 p-4 bg-accent/50 rounded-lg">
            <div className="w-2 h-2 bg-emergency rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-emergency rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-emergency rounded-full animate-pulse delay-150"></div>
            <span className="text-sm text-muted-foreground ml-2">Listening...</span>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!symptoms.trim()}
          variant="medical"
          size="lg"
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          Analyze Symptoms
        </Button>
      </CardContent>
    </Card>
  );
};