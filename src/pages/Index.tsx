import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Clock, ArrowLeft } from 'lucide-react';
import { SymptomInput } from '@/components/SymptomInput';
import { DiagnosisDisplay } from '@/components/DiagnosisDisplay';
import { CarePlan } from '@/components/CarePlan';
import { toast } from "sonner";

type AppState = 'welcome' | 'symptoms' | 'diagnosis' | 'careplan' | 'invalid';
type CareType = 'homecare' | 'medical';
type EmergencyLevel = 'critical' | 'moderate' | 'low';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [symptoms, setSymptoms] = useState('');
  const [careType, setCareType] = useState<CareType>('homecare');
  const [emergencyLevel, setEmergencyLevel] = useState<EmergencyLevel>('low');
  const [isValidInput, setIsValidInput] = useState(true);

  // Function to validate if input contains actual symptoms
  const validateSymptomsInput = (symptomsText: string): boolean => {
    if (!symptomsText.trim()) return false;
    
    const lowerSymptoms = symptomsText.toLowerCase();
    
    // Common non-symptom phrases to detect
    const irrelevantPhrases = [
      'my name is', 'i am', 'hello', 'hi', 'hey', 'good morning', 'good afternoon',
      'thank you', 'thanks', 'please', 'help', 'what is', 'how to', 'can you',
      'who are you', 'what can you do', 'test', 'testing', 'just checking',
      'nothing', 'fine', 'ok', 'okay', 'good', 'well', 'perfect', 'excellent'
    ];
    
    // Common symptom-related words
    const symptomKeywords = [
      'pain', 'ache', 'hurt', 'fever', 'headache', 'nausea', 'vomit', 'dizziness',
      'cough', 'cold', 'flu', 'sore', 'swell', 'rash', 'itch', 'burn', 'bleed',
      'breath', 'chest', 'heart', 'stomach', 'abdominal', 'back', 'joint', 'muscle',
      'fatigue', 'tired', 'weak', 'dizzy', 'faint', 'chill', 'sweat', 'temperature',
      'blood', 'pressure', 'diarrhea', 'constipation', 'allergy', 'allergic',
      'infection', 'inflamed', 'redness', 'swelling', 'numb', 'tingle', 'vision',
      'hear', 'ear', 'nose', 'throat', 'skin', 'sleep', 'appetite', 'weight'
    ];
    
    // Check if input contains irrelevant phrases without symptoms
    const hasIrrelevantPhrase = irrelevantPhrases.some(phrase => 
      lowerSymptoms.includes(phrase)
    );
    
    // Check if input contains actual symptom keywords
    const hasSymptomKeywords = symptomKeywords.some(keyword =>
      lowerSymptoms.includes(keyword)
    );
    
    // If it has irrelevant phrases but no symptom keywords, it's likely invalid
    if (hasIrrelevantPhrase && !hasSymptomKeywords) {
      return false;
    }
    
    // If it's very short and doesn't contain symptoms, likely invalid
    if (symptomsText.trim().length < 10 && !hasSymptomKeywords) {
      return false;
    }
    
    return true;
  };

  // Function to calculate emergency level based on symptoms
  const calculateEmergencyLevel = (symptomsText: string): EmergencyLevel => {
    if (!validateSymptomsInput(symptomsText)) return 'low';
    
    const lowerSymptoms = symptomsText.toLowerCase();
    
    if(lowerSymptoms.includes('chest pain') || 
        lowerSymptoms.includes('difficulty breathing') || 
        lowerSymptoms.includes('severe pain') ||
        lowerSymptoms.includes('unconscious') ||
        lowerSymptoms.includes('bleeding heavily') ||
        lowerSymptoms.includes('burn') ||
        lowerSymptoms.includes('cancer') ||
        lowerSymptoms.includes('allergic reaction') ||
        lowerSymptoms.includes('stroke') ||
        lowerSymptoms.includes('heart attack') ||
        lowerSymptoms.includes('seizure') ||
        lowerSymptoms.includes('pregnancy complication') ||
        lowerSymptoms.includes('head injury') ||
        lowerSymptoms.includes('poisoning') ||
        lowerSymptoms.includes('choking') ||
        lowerSymptoms.includes('drowning') ||
        lowerSymptoms.includes('sudden numbness')||
        lowerSymptoms.includes('sudden vision loss') ||
        lowerSymptoms.includes('suicidal thoughts') ||
        lowerSymptoms.includes('homicidal thoughts') ||
        lowerSymptoms.includes('severe allergic reaction') ||
        lowerSymptoms.includes('anaphylaxis')  ||       
        lowerSymptoms.includes('severe bleeding') ||
        lowerSymptoms.includes('severe burns') ||
        lowerSymptoms.includes('loss of consciousness') ||
        lowerSymptoms.includes('uncontrolled bleeding') ||
        lowerSymptoms.includes('severe head injury') ||
        lowerSymptoms.includes('spinal injury')
    ) {
      return 'critical';
    } else if (lowerSymptoms.includes('high fever') || 
                lowerSymptoms.includes('weakness') ||
                lowerSymptoms.includes('confusion') ||
               lowerSymptoms.includes('persistent vomiting') || 
               lowerSymptoms.includes('dehydration') ||
               lowerSymptoms.includes('severe headache') ||
               lowerSymptoms.includes('injury') ||
               lowerSymptoms.includes('infection')) {
      return 'moderate';
    } else {
      return 'low';
    }
  };

  const handleSymptomsSubmit = (symptomsText: string) => {
    const isValid = validateSymptomsInput(symptomsText);
    setIsValidInput(isValid);
    
    if (!isValid) {
      setCurrentState('invalid');
      toast.error("Please describe your symptoms in detail");
      return;
    }
    
    setSymptoms(symptomsText);
    const level = calculateEmergencyLevel(symptomsText);
    setEmergencyLevel(level);
    setCurrentState('diagnosis');
    
    // Show appropriate toast based on emergency level
    if (level === 'critical') {
      toast.error("🚨 Critical symptoms detected - Emergency assessment required!");
    } else if (level === 'moderate') {
      toast.warning("⚠️ Moderate symptoms detected - Medical evaluation recommended");
    } else {
      toast.success("Symptoms analyzed successfully");
    }
  };

  const handleCarePathSelect = (path: CareType) => {
    setCareType(path);
    setCurrentState('careplan');
    
    if (emergencyLevel === 'critical' && path === 'medical') {
      toast.error("🚑 CRITICAL: Emergency care plan activated with auto-call timer");
    } else {
      toast.success(`${path === 'homecare' ? 'Home care' : 'Medical care'} plan generated`);
    }
  };

  const handleEmergencyCall = () => {
    if (emergencyLevel === 'critical') {
      toast.error("🚨 EMERGENCY: Calling 911 - Help is on the way!");
    } else {
      toast.warning("📞 Contacting medical provider for assistance");
    }
  };

  const resetApp = () => {
    setCurrentState('welcome');
    setSymptoms('');
    setCareType('homecare');
    setEmergencyLevel('low');
    setIsValidInput(true);
  };

  const retrySymptoms = () => {
    setCurrentState('symptoms');
    setIsValidInput(true);
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
              * Please describe your symptoms clearly for accurate assessment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentState === 'invalid') {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={resetApp} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
            <h1 className="text-2xl font-bold text-foreground">HealthAI Assistant</h1>
          </div>

          <Card className="w-full max-w-2xl mx-auto shadow-medical">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-warning">
                Unable to Analyze Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-warning" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Please Describe Your Symptoms</h3>
                <p className="text-muted-foreground">
                  I couldn't identify any health symptoms in your description. 
                  Please tell me about how you're feeling, any pain, discomfort, 
                  or specific symptoms you're experiencing.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg text-left">
                <h4 className="font-medium mb-2">Examples of helpful descriptions:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• "I have a fever and headache for the past two days"</li>
                  <li>• "My stomach hurts and I feel nauseous"</li>
                  <li>• "I'm experiencing chest pain and difficulty breathing"</li>
                  <li>• "I have a sore throat and cough with body aches"</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="medical" onClick={retrySymptoms}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={resetApp}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
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
            onClick={currentState === 'symptoms' ? resetApp : () => setCurrentState(currentState === 'careplan' ? 'diagnosis' : 'symptoms')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentState === 'symptoms' ? 'Home' : 'Back'}
          </Button>
          <h1 className="text-2xl font-bold text-foreground">HealthAI Assistant</h1>
          {emergencyLevel === 'critical' && currentState !== 'symptoms' && (
            <div className="ml-auto px-3 py-1 bg-emergency/10 border border-emergency/20 rounded-full">
              <span className="text-emergency text-sm font-medium">CRITICAL</span>
            </div>
          )}
        </div>

        {currentState === 'symptoms' && (
          <SymptomInput onSubmit={handleSymptomsSubmit} />
        )}

        {currentState === 'diagnosis' && (
          <DiagnosisDisplay 
            symptoms={symptoms}
            emergencyLevel={emergencyLevel}
            onCarePathSelect={handleCarePathSelect}
          />
        )}

        {currentState === 'careplan' && (
          <CarePlan 
            careType={careType}
            symptoms={symptoms}
            emergencyLevel={emergencyLevel}
            onEmergencyCall={handleEmergencyCall}
          />
        )}
      </div>
    </div>
  );
};

export default Index;