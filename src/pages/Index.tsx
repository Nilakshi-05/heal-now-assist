import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Clock, ArrowLeft } from 'lucide-react';
import { SymptomInput } from '@/components/SymptomInput';
import { DiagnosisDisplay } from '@/components/DiagnosisDisplay';
import { CarePlan } from '@/components/CarePlan';
import { toast } from "sonner";

type AppState = 'welcome' | 'symptoms' | 'diagnosis' | 'careplan';
type CareType = 'homecare' | 'medical';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [symptoms, setSymptoms] = useState('');
  const [careType, setCareType] = useState<CareType>('homecare');

  const handleSymptomsSubmit = (symptomsText: string) => {
    setSymptoms(symptomsText);
    setCurrentState('diagnosis');
    toast.success("Symptoms analyzed successfully");
  };

  const handleCarePathSelect = (path: CareType) => {
    setCareType(path);
    setCurrentState('careplan');
    toast.success(`${path === 'homecare' ? 'Home care' : 'Medical care'} plan generated`);
  };

  const handleEmergencyCall = () => {
    toast.error("🚨 Emergency services contacted - Help is on the way!");
    // In a real app, this would trigger actual emergency services
  };

  const resetApp = () => {
    setCurrentState('welcome');
    setSymptoms('');
    setCareType('homecare');
  };

  if (currentState === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-medical">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              HealthAI Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Get instant health assessments and personalized care recommendations 
              powered by AI technology
            </p>
            <Button 
              variant="medical" 
              size="lg" 
              onClick={() => setCurrentState('symptoms')}
              className="text-lg px-8 py-6"
            >
              Start Health Assessment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-medical hover:shadow-success transition-medical">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-success" />
                </div>
                <CardTitle>AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Advanced AI analyzes your symptoms to provide preliminary assessments 
                  and appropriate care recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medical hover:shadow-success transition-medical">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Emergency Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Automatic emergency level assessment with smart alerts and 
                  direct connection to emergency services when needed.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medical hover:shadow-success transition-medical">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <CardTitle>24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Get instant health guidance anytime, anywhere with voice or 
                  text input for maximum convenience.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              * This AI assistant provides preliminary assessments and is not a substitute for professional medical advice
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={currentState === 'symptoms' ? resetApp : () => setCurrentState('symptoms')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentState === 'symptoms' ? 'Home' : 'Back'}
          </Button>
          <h1 className="text-2xl font-bold text-foreground">HealthAI Assistant</h1>
        </div>

        {currentState === 'symptoms' && (
          <SymptomInput onSubmit={handleSymptomsSubmit} />
        )}

        {currentState === 'diagnosis' && (
          <DiagnosisDisplay 
            symptoms={symptoms}
            onCarePathSelect={handleCarePathSelect}
          />
        )}

        {currentState === 'careplan' && (
          <CarePlan 
            careType={careType}
            symptoms={symptoms}
            onEmergencyCall={handleEmergencyCall}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
