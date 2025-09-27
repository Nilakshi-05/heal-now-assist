import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Activity, Heart } from 'lucide-react';

interface DiagnosisDisplayProps {
  symptoms: string;
  onCarePathSelect: (path: 'homecare' | 'medical') => void;
  emergencyLevel: 'critical' | 'moderate' | 'low';
}

export const DiagnosisDisplay: React.FC<DiagnosisDisplayProps> = ({ 
  symptoms, 
  onCarePathSelect, 
  emergencyLevel 
}) => {
  // Use the emergencyLevel prop instead of recalculating
  const getDiagnosisInfo = () => {
    switch (emergencyLevel) {
      case 'critical':
        return {
          condition: 'Potential Emergency Condition',
          confidence: 92,
          description: 'Your symptoms indicate a potentially life-threatening condition that requires immediate medical attention.',
          warning: 'DO NOT delay seeking medical care. Call emergency services immediately.',
        };
      case 'moderate':
        return {
          condition: 'Moderate Severity Condition',
          confidence: 78,
          description: 'Your symptoms suggest a condition that should be evaluated by a healthcare professional soon.',
          warning: 'Seek medical care within 24 hours if symptoms persist or worsen.',
        };
      default: // low
        return {
          condition: 'Mild Self-Limiting Condition',
          confidence: 85,
          description: 'Your symptoms appear to be mild and may be managed with appropriate self-care measures.',
          warning: 'Monitor symptoms and seek care if they worsen or persist beyond 3 days.',
        };
    }
  };

  const diagnosis = getDiagnosisInfo();

  const getEmergencyIcon = () => {
    switch (emergencyLevel) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-emergency" />;
      case 'moderate':
        return <Activity className="w-5 h-5 text-warning" />;
      default:
        return <Heart className="w-5 h-5 text-success" />;
    }
  };

  const getEmergencyVariant = () => {
    switch (emergencyLevel) {
      case 'critical':
        return 'destructive';
      case 'moderate':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <Card className="shadow-medical">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getEmergencyIcon()}
            <span>Medical Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{diagnosis.condition}</h3>
              <Badge variant={getEmergencyVariant()}>
                {emergencyLevel.toUpperCase()} PRIORITY
              </Badge>
            </div>
            <p className="text-muted-foreground">{diagnosis.description}</p>
            
            {emergencyLevel === 'critical' && (
              <div className="p-3 bg-emergency/10 border border-emergency/20 rounded-lg">
                <p className="text-sm font-medium text-emergency">{diagnosis.warning}</p>
              </div>
            )}
            
            {emergencyLevel === 'moderate' && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm font-medium text-warning">{diagnosis.warning}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Assessment Confidence:</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${diagnosis.confidence}%` }}
                />
              </div>
              <span className="text-sm font-medium">{diagnosis.confidence}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-medical">
        <CardHeader>
          <CardTitle>Recommended Care Pathway</CardTitle>
          <p className="text-muted-foreground">
            Based on your assessment, select the appropriate care option.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onCarePathSelect('homecare')}
            className="p-6 rounded-lg border-2 border-muted hover:border-success hover:bg-success/5 transition-medical group"
            disabled={emergencyLevel === 'critical'}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center group-hover:bg-success/20 transition-medical">
                <Heart className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-lg">Self-Care & Home Management</h3>
              <p className="text-sm text-muted-foreground">
                Appropriate for mild symptoms with guided home care instructions
              </p>
              {emergencyLevel === 'critical' && (
                <p className="text-xs text-emergency font-medium">
                  Not recommended for your current symptoms
                </p>
              )}
            </div>
          </button>

          <button
            onClick={() => onCarePathSelect('medical')}
            className="p-6 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-medical group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-medical">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Professional Medical Care</h3>
              <p className="text-sm text-muted-foreground">
                {emergencyLevel === 'critical' 
                  ? 'Immediate emergency care required' 
                  : 'Medical evaluation and treatment options'}
              </p>
            </div>
          </button>
        </CardContent>
      </Card>


    </div>
  );
};

// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { AlertTriangle, Activity, Heart } from 'lucide-react';

// interface DiagnosisDisplayProps {
//   symptoms: string;
//   onCarePathSelect: (path: 'homecare' | 'medical') => void;
// }

// export const DiagnosisDisplay: React.FC<DiagnosisDisplayProps> = ({ symptoms, onCarePathSelect }) => {
//   // Simulate AI diagnosis based on symptoms
//   const getDiagnosis = (symptoms: string) => {
//     const lowerSymptoms = symptoms.toLowerCase();
    
//     if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('difficulty breathing') || lowerSymptoms.includes('severe')) {
//       return {
//         condition: 'Possible Cardiac Event',
//         emergencyLevel: 'critical',
//         confidence: 85,
//         description: 'Based on your symptoms, this requires immediate medical attention.',
//       };
//     } else if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('headache')) {
//       return {
//         condition: 'Viral Infection',
//         emergencyLevel: 'moderate',
//         confidence: 78,
//         description: 'Common viral symptoms that may benefit from medical evaluation.',
//       };
//     } else {
//       return {
//         condition: 'Minor Illness',
//         emergencyLevel: 'low',
//         confidence: 72,
//         description: 'Symptoms appear manageable with proper care.',
//       };
//     }
//   };

//   const diagnosis = getDiagnosis(symptoms);

//   const getEmergencyIcon = () => {
//     switch (diagnosis.emergencyLevel) {
//       case 'critical':
//         return <AlertTriangle className="w-5 h-5 text-emergency" />;
//       case 'moderate':
//         return <Activity className="w-5 h-5 text-warning" />;
//       default:
//         return <Heart className="w-5 h-5 text-success" />;
//     }
//   };

//   const getEmergencyVariant = () => {
//     switch (diagnosis.emergencyLevel) {
//       case 'critical':
//         return 'destructive';
//       case 'moderate':
//         return 'secondary';
//       default:
//         return 'outline';
//     }
//   };

//   return (
//     <div className="space-y-6 w-full max-w-2xl mx-auto">
//       <Card className="shadow-medical">
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             {getEmergencyIcon()}
//             <span>Preliminary Assessment</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold">{diagnosis.condition}</h3>
//               <Badge variant={getEmergencyVariant()}>
//                 {diagnosis.emergencyLevel.toUpperCase()}
//               </Badge>
//             </div>
//             <p className="text-muted-foreground">{diagnosis.description}</p>
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-muted-foreground">Confidence:</span>
//               <div className="flex-1 bg-muted rounded-full h-2">
//                 <div 
//                   className="bg-primary h-2 rounded-full transition-all duration-1000"
//                   style={{ width: `${diagnosis.confidence}%` }}
//                 />
//               </div>
//               <span className="text-sm font-medium">{diagnosis.confidence}%</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className="shadow-medical">
//         <CardHeader>
//           <CardTitle>Choose Your Care Path</CardTitle>
//           <p className="text-muted-foreground">
//             Select the type of care that feels right for your situation.
//           </p>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <button
//             onClick={() => onCarePathSelect('homecare')}
//             className="p-6 rounded-lg border-2 border-muted hover:border-success hover:bg-success/5 transition-medical group"
//           >
//             <div className="space-y-3">
//               <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center group-hover:bg-success/20 transition-medical">
//                 <Heart className="w-6 h-6 text-success" />
//               </div>
//               <h3 className="font-semibold text-lg">Home Care</h3>
//               <p className="text-sm text-muted-foreground">
//                 Get home remedies and self-care guidance
//               </p>
//             </div>
//           </button>

//           <button
//             onClick={() => onCarePathSelect('medical')}
//             className="p-6 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-medical group"
//           >
//             <div className="space-y-3">
//               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-medical">
//                 <Activity className="w-6 h-6 text-primary" />
//               </div>
//               <h3 className="font-semibold text-lg">Medical Care</h3>
//               <p className="text-sm text-muted-foreground">
//                 Get prescription and emergency options
//               </p>
//             </div>
//           </button>
//         </CardContent>
//       </Card>

//       <div className="text-center">
//         <p className="text-xs text-muted-foreground">
//           * This is an AI assessment and should not replace professional medical advice
//         </p>
//       </div>
//     </div>
//   );
// };