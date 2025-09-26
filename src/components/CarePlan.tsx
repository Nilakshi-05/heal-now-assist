import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Stethoscope, Phone, Clock, CheckCircle } from 'lucide-react';
import { EmergencyTimer } from './EmergencyTimer';

interface CarePlanProps {
  careType: 'homecare' | 'medical';
  symptoms: string;
  onEmergencyCall: () => void;
}

export const CarePlan: React.FC<CarePlanProps> = ({ careType, symptoms, onEmergencyCall }) => {
  const [showTimer, setShowTimer] = useState(careType === 'medical');

  const getHomeCareRemedies = () => [
    "Rest and get plenty of sleep (8+ hours)",
    "Stay hydrated - drink warm fluids like herbal tea",
    "Apply a cool compress to your forehead for headaches",
    "Take acetaminophen or ibuprofen as directed for fever",
    "Monitor your temperature every 4-6 hours",
    "Eat light, easily digestible foods",
    "Consider honey and ginger tea for symptom relief"
  ];

  const getMedicalPrescription = () => ({
    medications: [
      { name: "Acetaminophen", dosage: "500mg every 6 hours", duration: "3-5 days" },
      { name: "Ibuprofen", dosage: "400mg every 8 hours", duration: "As needed" },
      { name: "Oral Rehydration Solution", dosage: "As needed", duration: "Until symptoms improve" }
    ],
    instructions: [
      "Seek immediate care if fever exceeds 103°F (39.4°C)",
      "Return if symptoms worsen or persist beyond 5 days",
      "Follow up with primary care physician in 3-5 days",
      "Avoid strenuous activities until fever-free for 24 hours"
    ]
  });

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <Card className="shadow-medical">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {careType === 'homecare' ? (
              <Home className="w-5 h-5 text-success" />
            ) : (
              <Stethoscope className="w-5 h-5 text-primary" />
            )}
            <span>
              {careType === 'homecare' ? 'Home Care Plan' : 'Medical Care Plan'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {careType === 'homecare' ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Recommended Home Remedies</h3>
              <ul className="space-y-3">
                {getHomeCareRemedies().map((remedy, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{remedy}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="font-medium text-sm">When to Seek Medical Care</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contact a healthcare provider if symptoms worsen, fever exceeds 103°F, 
                  or you experience difficulty breathing or chest pain.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Prescribed Medications</h3>
                <div className="space-y-3">
                  {getMedicalPrescription().medications.map((med, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{med.name}</span>
                        <Badge variant="outline">{med.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{med.dosage}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Medical Instructions</h3>
                <ul className="space-y-3">
                  {getMedicalPrescription().instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="emergency"
                  size="lg"
                  onClick={onEmergencyCall}
                  className="w-full"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Ambulance Now
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showTimer && (
        <EmergencyTimer
          onEmergencyCall={onEmergencyCall}
          onDismiss={() => setShowTimer(false)}
        />
      )}

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          * Always consult with a qualified healthcare professional for proper medical advice
        </p>
      </div>
    </div>
  );
};