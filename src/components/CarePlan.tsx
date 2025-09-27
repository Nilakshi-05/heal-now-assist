import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Stethoscope, Phone, Clock, CheckCircle, AlertTriangle, Ambulance } from 'lucide-react';
import { EmergencyTimer } from './EmergencyTimer';

interface CarePlanProps {
  careType: 'homecare' | 'medical';
  symptoms: string;
  emergencyLevel: 'critical' | 'moderate' | 'low';
  onEmergencyCall: () => void;
}

export const CarePlan: React.FC<CarePlanProps> = ({ 
  careType, 
  symptoms, 
  emergencyLevel, 
  onEmergencyCall 
}) => {
  const [showTimer, setShowTimer] = useState(emergencyLevel === 'critical' && careType === 'medical');

  const getHomeCareRemedies = () => {
    const lowerSymptoms = symptoms.toLowerCase();
    
    if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('cold') || lowerSymptoms.includes('flu')) {
      return [
        "Rest in a quiet, comfortable environment and maintain adequate sleep (7-9 hours)",
        "Hydrate frequently with water, electrolyte solutions, or warm herbal teas",
        "Use a digital thermometer to monitor temperature every 4-6 hours",
        "Apply cool compresses to forehead, wrists, and neck for fever relief",
        "Consider over-the-counter fever reducers like acetaminophen (follow dosage instructions)",
        "Use a humidifier to ease respiratory discomfort and maintain 40-60% humidity",
        "Consume light, nutritious foods like broth, toast, and bananas (BRAT diet)",
        "Gargle with warm salt water for throat irritation",
        "Practice good hand hygiene to prevent spreading infection"
      ];
    } else if (lowerSymptoms.includes('headache') || lowerSymptoms.includes('migraine')) {
      return [
        "Rest in a dark, quiet room to reduce sensory stimulation",
        "Apply a cold compress to forehead or back of neck for 15-20 minutes",
        "Stay hydrated - drink water consistently throughout the day",
        "Practice relaxation techniques like deep breathing or meditation",
        "Consider over-the-counter pain relief as directed (ibuprofen, aspirin)",
        "Avoid triggers like bright lights, loud noises, and strong odors",
        "Maintain regular meal schedules to prevent low blood sugar",
        "Apply gentle pressure to temples or use peppermint oil for tension relief"
      ];
    } else if (lowerSymptoms.includes('stomach') || lowerSymptoms.includes('nausea')) {
      return [
        "Follow the BRAT diet (Bananas, Rice, Applesauce, Toast) for easy digestion",
        "Stay hydrated with small, frequent sips of clear fluids",
        "Avoid dairy, fatty, spicy, or high-fiber foods temporarily",
        "Use ginger tea or ginger capsules to reduce nausea",
        "Rest in a comfortable position, preferably sitting up or on your side",
        "Apply a warm compress to the abdomen for cramp relief",
        "Practice deep breathing exercises to manage discomfort",
        "Reintroduce normal foods gradually as symptoms improve"
      ];
    } else {
      return [
        "Get adequate rest and maintain a regular sleep schedule",
        "Stay well-hydrated with water and electrolyte-balanced fluids",
        "Monitor symptoms closely and keep a symptom diary",
        "Maintain a comfortable environment with proper ventilation",
        "Practice good personal hygiene and infection prevention",
        "Eat balanced, nutritious meals to support recovery",
        "Avoid strenuous activities until symptoms resolve",
        "Seek medical attention if symptoms worsen or new symptoms appear"
      ];
    }
  };

  const getMedicalPrescription = () => ({
    medications: [
      { name: "Acetaminophen", dosage: "500-1000mg every 4-6 hours", duration: "As needed for pain/fever", max: "4000mg per day" },
      { name: "Ibuprofen", dosage: "200-400mg every 4-6 hours", duration: "With food, as needed", max: "1200mg per day" },
      { name: "Oral Rehydration Salts", dosage: "1 packet in 1L water, as needed", duration: "Until hydration improves" },
      { name: "Antihistamines", dosage: "As directed for allergy symptoms", duration: "As needed" }
    ],
    instructions: [
      "Seek immediate emergency care for: chest pain, difficulty breathing, severe bleeding",
      "Follow up with primary care physician within 24-48 hours",
      "Complete any prescribed medication courses as directed",
      "Return to emergency department if symptoms worsen suddenly",
      "Keep a record of symptom progression and medication times",
      "Avoid driving or operating machinery if taking sedating medications",
      "Maintain follow-up appointments for proper monitoring"
    ],
    emergencyContacts: [
      "Local Emergency Services: 911",
      "Poison Control: 1-800-222-1222",
      "24/7 Nurse Line: 1-800-XXX-XXXX",
      "Nearest Urgent Care: [Address based on location]"
    ]
  });

  const handleEmergencyCall = () => {
    // Simulate emergency call
    console.log('Calling emergency services...');
    alert('🚑 EMERGENCY: Calling local emergency services (911)...\n\nPlease stay on the line and be prepared to provide:\n- Your location\n- Nature of emergency\n- Current symptoms\n- Any known medical conditions');
    
    // You can add actual emergency call functionality here
    // For example: window.open('tel:911');
  };

  const handleMedicalContact = () => {
    // For non-critical cases, contact regular medical provider
    console.log('Contacting medical provider...');
    alert('📞 Contacting your medical provider...\n\nRecommended actions:\n- Call your primary care physician\n- Visit urgent care if available\n- Schedule a telehealth appointment');
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      {emergencyLevel === 'critical' && (
        <Card className="border-emergency/20 bg-emergency/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-emergency">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">CRITICAL CONDITION DETECTED</span>
            </div>
            <p className="text-sm mt-1">
              Your symptoms indicate a potential emergency. Please seek immediate medical attention.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-medical">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {careType === 'homecare' ? (
              <Home className="w-5 h-5 text-success" />
            ) : (
              <Stethoscope className="w-5 h-5 text-primary" />
            )}
            <span>
              {careType === 'homecare' ? 'Home Care Management Plan' : 'Medical Treatment Plan'}
            </span>
            {emergencyLevel === 'critical' && (
              <Badge variant="destructive">EMERGENCY</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {careType === 'homecare' ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Comprehensive Self-Care Guidelines</h3>
              <ul className="space-y-3">
                {getHomeCareRemedies().map((remedy, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{remedy}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="font-medium text-sm">When to Seek Higher Level Care</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contact emergency services immediately if you experience: chest pain, difficulty breathing, 
                  severe bleeding, sudden weakness, confusion, or symptoms rapidly worsening.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Recommended Treatment Options</h3>
                <div className="space-y-3">
                  {getMedicalPrescription().medications.map((med, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{med.name}</span>
                        <Badge variant="outline">{med.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{med.dosage}</p>
                      {med.max && <p className="text-xs text-warning mt-1">Max: {med.max}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Medical Instructions & Precautions</h3>
                <ul className="space-y-3">
                  {getMedicalPrescription().instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Emergency Contacts</h3>
                <div className="grid grid-cols-1 gap-2">
                  {getMedicalPrescription().emergencyContacts.map((contact, index) => (
                    <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                      {contact}
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Call Button - Only for critical level */}
              {emergencyLevel === 'critical' && (
                <div className="pt-4 border-t">
                  <Button
                    variant="emergency"
                    size="lg"
                    onClick={handleEmergencyCall}
                    className="w-full mb-3"
                  >
                    <Ambulance className="w-4 h-4 mr-2" />
                    CALL AMBULANCE NOW (911)
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onEmergencyCall}
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    SOS - Alert Emergency Contacts
                  </Button>
                </div>
              )}

              {/* Regular medical contact for moderate/low levels */}
              {(emergencyLevel === 'moderate' || emergencyLevel === 'low') && (
                <div className="pt-4 border-t">
                  <Button
                    variant="medical"
                    size="lg"
                    onClick={handleMedicalContact}
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Medical Provider
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Only show emergency timer for critical conditions with medical care plan */}
      {showTimer && emergencyLevel === 'critical' && careType === 'medical' && (
        <EmergencyTimer
          onEmergencyCall={handleEmergencyCall}
          onDismiss={() => setShowTimer(false)}
        />
      )}

      {/* <div className="text-center">
        <p className="text-xs text-muted-foreground">
          * This information is for educational purposes only. Always consult with qualified healthcare professionals for medical advice.
        </p>
      </div> */}
    </div>
  );
};
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Home, Stethoscope, Phone, Clock, CheckCircle } from 'lucide-react';
// import { EmergencyTimer } from './EmergencyTimer';

// interface CarePlanProps {
//   careType: 'homecare' | 'medical';
//   symptoms: string;
//   onEmergencyCall: () => void;
// }

// export const CarePlan: React.FC<CarePlanProps> = ({ careType, symptoms, onEmergencyCall }) => {
//   const [showTimer, setShowTimer] = useState(careType === 'medical');

//   const getHomeCareRemedies = () => [
//     "Rest and get plenty of sleep (8+ hours)",
//     "Stay hydrated - drink warm fluids like herbal tea",
//     "Apply a cool compress to your forehead for headaches",
//     "Take acetaminophen or ibuprofen as directed for fever",
//     "Monitor your temperature every 4-6 hours",
//     "Eat light, easily digestible foods",
//     "Consider honey and ginger tea for symptom relief"
//   ];

//   const getMedicalPrescription = () => ({
//     medications: [
//       { name: "Acetaminophen", dosage: "500mg every 6 hours", duration: "3-5 days" },
//       { name: "Ibuprofen", dosage: "400mg every 8 hours", duration: "As needed" },
//       { name: "Oral Rehydration Solution", dosage: "As needed", duration: "Until symptoms improve" }
//     ],
//     instructions: [
//       "Seek immediate care if fever exceeds 103°F (39.4°C)",
//       "Return if symptoms worsen or persist beyond 5 days",
//       "Follow up with primary care physician in 3-5 days",
//       "Avoid strenuous activities until fever-free for 24 hours"
//     ]
//   });

//   return (
//     <div className="space-y-6 w-full max-w-2xl mx-auto">
//       <Card className="shadow-medical">
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             {careType === 'homecare' ? (
//               <Home className="w-5 h-5 text-success" />
//             ) : (
//               <Stethoscope className="w-5 h-5 text-primary" />
//             )}
//             <span>
//               {careType === 'homecare' ? 'Home Care Plan' : 'Medical Care Plan'}
//             </span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {careType === 'homecare' ? (
//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Recommended Home Remedies</h3>
//               <ul className="space-y-3">
//                 {getHomeCareRemedies().map((remedy, index) => (
//                   <li key={index} className="flex items-start space-x-3">
//                     <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
//                     <span className="text-sm">{remedy}</span>
//                   </li>
//                 ))}
//               </ul>
              
//               <div className="mt-6 p-4 bg-muted/50 rounded-lg">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <Clock className="w-4 h-4 text-warning" />
//                   <span className="font-medium text-sm">When to Seek Medical Care</span>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Contact a healthcare provider if symptoms worsen, fever exceeds 103°F, 
//                   or you experience difficulty breathing or chest pain.
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               <div>
//                 <h3 className="font-semibold text-lg mb-4">Prescribed Medications</h3>
//                 <div className="space-y-3">
//                   {getMedicalPrescription().medications.map((med, index) => (
//                     <div key={index} className="border rounded-lg p-3">
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="font-medium">{med.name}</span>
//                         <Badge variant="outline">{med.duration}</Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground">{med.dosage}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h3 className="font-semibold text-lg mb-4">Medical Instructions</h3>
//                 <ul className="space-y-3">
//                   {getMedicalPrescription().instructions.map((instruction, index) => (
//                     <li key={index} className="flex items-start space-x-3">
//                       <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
//                       <span className="text-sm">{instruction}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="pt-4 border-t">
//                 <Button
//                   variant="emergency"
//                   size="lg"
//                   onClick={onEmergencyCall}
//                   className="w-full"
//                 >
//                   <Phone className="w-4 h-4 mr-2" />
//                   Call Ambulance Now
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {showTimer && (
//         <EmergencyTimer
//           onEmergencyCall={onEmergencyCall}
//           onDismiss={() => setShowTimer(false)}
//         />
//       )}

//       <div className="text-center">
//         <p className="text-xs text-muted-foreground">
//           * Always consult with a qualified healthcare professional for proper medical advice
//         </p>
//       </div>
//     </div>
//   );
// };