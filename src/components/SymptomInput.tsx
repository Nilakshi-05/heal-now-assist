import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Send, AlertCircle, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

// Add TypeScript declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface SymptomInputProps {
  onSubmit: (symptoms: string) => void;
}

export const SymptomInput: React.FC<SymptomInputProps> = ({ onSubmit }) => {
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const checkSupport = () => {
      return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    };

    const supported = checkSupport();
    setIsSupported(supported);

    if (!supported) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    try {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      const recognition = recognitionRef.current;
      recognition.continuous = false; // Changed to false to stop after speech ends
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        toast.info("🎤 Listening... Speak now");
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }

        // Update transcript with both final and interim results
        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'no-speech':
            toast.error("No speech detected. Please try again.");
            break;
          case 'audio-capture':
            toast.error("No microphone found. Please check your microphone.");
            break;
          case 'not-allowed':
            toast.error("Microphone access denied. Please allow microphone permissions.");
            break;
          default:
            toast.error("Error with voice input. Please try typing instead.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Only add to symptoms if there's actual transcript
        if (transcript.trim()) {
          setSymptoms(prev => {
            const newText = prev ? prev + ' ' + transcript : transcript;
            return newText;
          });
          toast.success("Voice input added successfully");
        }
        setTranscript(''); // Clear transcript after adding
      };

    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setIsSupported(false);
      toast.error("Voice recognition unavailable");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []); // Empty dependency array

  const handleVoiceInput = async () => {
    if (!isSupported) {
      toast.error("Voice input not supported in your browser");
      return;
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current?.stop();
      setIsListening(false);
      toast.info("Voice input stopped");
    } else {
      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setTranscript(''); // Clear previous transcript
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Microphone permission denied:', error);
        toast.error("Microphone access is required for voice input");
      }
    }
  };

  const handleSubmit = () => {
    if (symptoms.trim()) {
      onSubmit(symptoms);
    } else {
      toast.error("Please describe your symptoms first");
    }
  };

  const addVoiceTranscript = () => {
    if (transcript.trim()) {
      setSymptoms(prev => {
        const newText = prev ? prev + ' ' + transcript : transcript;
        return newText;
      });
      setTranscript('');
      toast.success("Voice transcript added");
    }
  };

  const clearSymptoms = () => {
    setSymptoms('');
    setTranscript('');
    toast.info("Input cleared");
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medical">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          Describe Your Symptoms
        </CardTitle>
        <p className="text-muted-foreground">
          Please describe what you're feeling in detail. Include symptoms, duration, and severity.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Example: I have a fever of 101°F, headache, and body aches for the past 2 days..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-32 pr-20 transition-medical focus:shadow-medical"
          />
          <div className="absolute top-2 right-2 flex space-x-1">
            {symptoms && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSymptoms}
                className="h-8 w-8"
                title="Clear all"
              >
                ×
              </Button>
            )}
            <Button
              variant={isListening ? "emergency" : "ghost"}
              size="icon"
              onClick={handleVoiceInput}
              disabled={!isSupported}
              className="h-8 w-8"
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 animate-pulse" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Voice input status */}
        {!isSupported && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning text-center">
              Voice input not supported in your browser. Please use Chrome, Edge, or Safari.
            </p>
          </div>
        )}

        {/* Current voice transcript */}
        {isListening && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {transcript ? "Speaking..." : "Listening... Speak now"}
              </span>
            </div>
            
            {transcript && (
              <>
                <p className="text-sm mb-3">{transcript}</p>
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={addVoiceTranscript}
                  >
                    Add to symptoms
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearTranscript}
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}
            
            {!transcript && (
              <div className="flex items-center justify-center space-x-2 py-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
              </div>
            )}
          </div>
        )}

        {/* Show recent transcript even when not listening */}
        {!isListening && transcript && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Volume2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Recent voice input</span>
            </div>
            <p className="text-sm mb-3">{transcript}</p>
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={addVoiceTranscript}
              >
                Add to symptoms
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearTranscript}
              >
                Discard
              </Button>
            </div>
          </div>
        )}

        {/* Tips section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">Tips for better assessment:</p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• Mention specific symptoms (fever, pain, cough, etc.)</li>
                <li>• Include duration (how long you've had symptoms)</li>
                <li>• Describe severity (mild, moderate, severe)</li>
                <li>• Speak clearly and at a normal pace for voice input</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Voice command examples */}
        {isSupported && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-2">
              <Volume2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-purple-800">Voice command examples:</p>
                <ul className="text-xs text-purple-700 mt-1 space-y-1">
                  <li>• "I have a headache and fever since yesterday"</li>
                  <li>• "My stomach hurts and I feel nauseous"</li>
                  <li>• "I'm experiencing chest pain and difficulty breathing"</li>
                  <li>• "Sore throat with cough and body aches for three days"</li>
                </ul>
              </div>
            </div>
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

        {!symptoms.trim() && (
          <p className="text-xs text-muted-foreground text-center">
            Please describe your symptoms to continue
          </p>
        )}
      </CardContent>
    </Card>
  );
};
// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Mic, MicOff, Send, AlertCircle, Volume2 } from 'lucide-react';
// import { toast } from 'sonner';

// interface SymptomInputProps {
//   onSubmit: (symptoms: string) => void;
// }

// export const SymptomInput: React.FC<SymptomInputProps> = ({ onSubmit }) => {
//   const [symptoms, setSymptoms] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [isSupported, setIsSupported] = useState(true);
//   const [transcript, setTranscript] = useState('');
//   const recognitionRef = useRef<SpeechRecognition | null>(null);

//   useEffect(() => {
//     // Check if browser supports Web Speech API
//     if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
//       setIsSupported(false);
//       return;
//     }

//     // Initialize speech recognition
//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();

//     const recognition = recognitionRef.current;
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';

//     recognition.onstart = () => {
//       setIsListening(true);
//       setTranscript('');
//       toast.info("🎤 Listening... Speak now");
//     };

//     recognition.onresult = (event: SpeechRecognitionEvent) => {
//       let interimTranscript = '';
//       let finalTranscript = '';

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           finalTranscript += transcript + ' ';
//         } else {
//           interimTranscript += transcript;
//         }
//       }

//       setTranscript(finalTranscript + interimTranscript);
//     };

//     recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
//       console.error('Speech recognition error:', event.error);
//       setIsListening(false);
      
//       switch (event.error) {
//         case 'no-speech':
//           toast.error("No speech detected. Please try again.");
//           break;
//         case 'audio-capture':
//           toast.error("No microphone found. Please check your microphone.");
//           break;
//         case 'not-allowed':
//           toast.error("Microphone access denied. Please allow microphone permissions.");
//           break;
//         default:
//           toast.error("Error with voice input. Please try typing instead.");
//       }
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//       if (transcript.trim()) {
//         setSymptoms(prev => prev + (prev ? ' ' : '') + transcript);
//         toast.success("Voice input completed");
//       }
//     };

//     return () => {
//       if (recognition) {
//         recognition.stop();
//       }
//     };
//   }, [transcript]);

//   const handleVoiceInput = () => {
//     if (!isSupported) {
//       toast.error("Voice input not supported in your browser");
//       return;
//     }

//     if (isListening) {
//       recognitionRef.current?.stop();
//       setIsListening(false);
//     } else {
//       // Request microphone permission
//       navigator.mediaDevices.getUserMedia({ audio: true })
//         .then(() => {
//           recognitionRef.current?.start();
//         })
//         .catch((error) => {
//           console.error('Microphone permission denied:', error);
//           toast.error("Microphone access is required for voice input");
//         });
//     }
//   };

//   const handleSubmit = () => {
//     if (symptoms.trim()) {
//       onSubmit(symptoms);
//     }
//   };

//   const addVoiceTranscript = () => {
//     if (transcript.trim()) {
//       setSymptoms(prev => prev + (prev ? ' ' : '') + transcript);
//       setTranscript('');
//     }
//   };

//   return (
//     <Card className="w-full max-w-2xl mx-auto shadow-medical">
//       <CardHeader className="text-center">
//         <CardTitle className="text-2xl font-bold text-primary">
//           Describe Your Symptoms
//         </CardTitle>
//         <p className="text-muted-foreground">
//           Please describe what you're feeling in detail. Include symptoms, duration, and severity.
//         </p>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="relative">
//           <Textarea
//             placeholder="Example: I have a fever of 101°F, headache, and body aches for the past 2 days..."
//             value={symptoms}
//             onChange={(e) => setSymptoms(e.target.value)}
//             className="min-h-32 pr-12 transition-medical focus:shadow-medical"
//           />
//           <Button
//             variant={isListening ? "destructive" : "ghost"}
//             size="icon"
//             className="absolute top-2 right-2"
//             onClick={handleVoiceInput}
//             disabled={!isSupported}
//           >
//             {isListening ? (
//               <MicOff className="w-4 h-4 animate-pulse" />
//             ) : (
//               <Mic className="w-4 h-4" />
//             )}
//           </Button>
//         </div>

//         {/* Voice input status */}
//         {!isSupported && (
//           <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
//             <p className="text-sm text-warning text-center">
//               Voice input not supported in your browser. Please use Chrome, Edge, or Safari.
//             </p>
//           </div>
//         )}

//         {/* Current voice transcript */}
//         {isListening && transcript && (
//           <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
//             <div className="flex items-center space-x-2 mb-2">
//               <Volume2 className="w-4 h-4 text-success" />
//               <span className="text-sm font-medium text-success">Listening...</span>
//             </div>
//             <p className="text-sm">{transcript}</p>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={addVoiceTranscript}
//               className="mt-2"
//             >
//               Add to symptoms
//             </Button>
//           </div>
//         )}

//         {isListening && !transcript && (
//           <div className="flex items-center justify-center space-x-2 p-4 bg-accent/50 rounded-lg">
//             <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
//             <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
//             <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
//             <span className="text-sm text-muted-foreground ml-2">Listening... Speak now</span>
//           </div>
//         )}

//         {/* Tips section */}
//         <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//           <div className="flex items-start space-x-2">
//             <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="text-sm font-medium text-blue-800">Tips for better assessment:</p>
//               <ul className="text-xs text-blue-700 mt-1 space-y-1">
//                 <li>• Mention specific symptoms (fever, pain, cough, etc.)</li>
//                 <li>• Include duration (how long you've had symptoms)</li>
//                 <li>• Describe severity (mild, moderate, severe)</li>
//                 <li>• Speak clearly and at a normal pace for voice input</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Voice command examples */}
//         <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
//           <div className="flex items-start space-x-2">
//             <Volume2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="text-sm font-medium text-purple-800">Voice command examples:</p>
//               <ul className="text-xs text-purple-700 mt-1 space-y-1">
//                 <li>• "I have a headache and fever since yesterday"</li>
//                 <li>• "My stomach hurts and I feel nauseous"</li>
//                 <li>• "I'm experiencing chest pain and difficulty breathing"</li>
//                 <li>• "Sore throat with cough and body aches for three days"</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <Button
//           onClick={handleSubmit}
//           disabled={!symptoms.trim()}
//           variant="medical"
//           size="lg"
//           className="w-full"
//         >
//           <Send className="w-4 h-4 mr-2" />
//           Analyze Symptoms
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };
// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Mic, MicOff, Send, AlertCircle } from 'lucide-react';

// interface SymptomInputProps {
//   onSubmit: (symptoms: string) => void;
// }

// export const SymptomInput: React.FC<SymptomInputProps> = ({ onSubmit }) => {
//   const [symptoms, setSymptoms] = useState('');
//   const [isListening, setIsListening] = useState(false);

//   const handleVoiceInput = () => {
//     setIsListening(!isListening);
//     if (!isListening) {
//       // Simulate voice input with better example
//       setTimeout(() => {
//         setSymptoms("I have been experiencing headache and fever since yesterday, with some body aches");
//         setIsListening(false);
//       }, 2000);
//     }
//   };

//   const handleSubmit = () => {
//     if (symptoms.trim()) {
//       onSubmit(symptoms);
//     }
//   };

//   return (
//     <Card className="w-full max-w-2xl mx-auto shadow-medical">
//       <CardHeader className="text-center">
//         <CardTitle className="text-2xl font-bold text-primary">
//           Describe Your Symptoms
//         </CardTitle>
//         <p className="text-muted-foreground">
//           Please describe what you're feeling in detail. Include symptoms, duration, and severity.
//         </p>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="relative">
//           <Textarea
//             placeholder="Example: I have a fever of 101°F, headache, and body aches for the past 2 days..."
//             value={symptoms}
//             onChange={(e) => setSymptoms(e.target.value)}
//             className="min-h-32 pr-12 transition-medical focus:shadow-medical"
//           />
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute top-2 right-2"
//             onClick={handleVoiceInput}
//           >
//             {isListening ? (
//               <MicOff className="w-4 h-4 text-emergency animate-pulse" />
//             ) : (
//               <Mic className="w-4 h-4 text-primary" />
//             )}
//           </Button>
//         </div>
        
//         {isListening && (
//           <div className="flex items-center justify-center space-x-2 p-4 bg-accent/50 rounded-lg">
//             <div className="w-2 h-2 bg-emergency rounded-full animate-pulse"></div>
//             <div className="w-2 h-2 bg-emergency rounded-full animate-pulse delay-75"></div>
//             <div className="w-2 h-2 bg-emergency rounded-full animate-pulse delay-150"></div>
//             <span className="text-sm text-muted-foreground ml-2">Listening... Describe your symptoms</span>
//           </div>
//         )}

//         <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//           <div className="flex items-start space-x-2">
//             <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="text-sm font-medium text-blue-800">Tips for better assessment:</p>
//               <ul className="text-xs text-blue-700 mt-1 space-y-1">
//                 <li>• Mention specific symptoms (fever, pain, cough, etc.)</li>
//                 <li>• Include duration (how long you've had symptoms)</li>
//                 <li>• Describe severity (mild, moderate, severe)</li>
//                 <li>• Mention any pre-existing conditions if relevant</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <Button
//           onClick={handleSubmit}
//           disabled={!symptoms.trim()}
//           variant="medical"
//           size="lg"
//           className="w-full"
//         >
//           <Send className="w-4 h-4 mr-2" />
//           Analyze Symptoms
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };