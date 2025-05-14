import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    points: {
      [key: string]: number;
    }
  }[];
}

interface PersonalityType {
  id: string;
  title: string;
  emoji: string;
  description: string;
  healthTip: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How often do you typically go?",
    options: [
      { 
        id: "1a", 
        text: "Multiple times a day", 
        points: { "regular": 3, "nervous": 2, "proud": 1, "casual": 0 } 
      },
      { 
        id: "1b", 
        text: "Once a day, like clockwork", 
        points: { "regular": 4, "proud": 2, "casual": 1, "nervous": 0 } 
      },
      { 
        id: "1c", 
        text: "Every couple of days", 
        points: { "casual": 3, "nervous": 1, "proud": 0, "regular": 0 } 
      },
      { 
        id: "1d", 
        text: "It's complicated...", 
        points: { "nervous": 4, "casual": 2, "proud": 0, "regular": 0 } 
      }
    ]
  },
  {
    id: 2,
    question: "When nature calls, you...",
    options: [
      { 
        id: "2a", 
        text: "Drop everything and go immediately", 
        points: { "nervous": 4, "regular": 2, "casual": 0, "proud": 0 } 
      },
      { 
        id: "2b", 
        text: "Schedule it into your routine", 
        points: { "regular": 4, "proud": 2, "casual": 0, "nervous": 0 } 
      },
      { 
        id: "2c", 
        text: "Hold it until it's convenient", 
        points: { "casual": 3, "proud": 1, "regular": 0, "nervous": 0 } 
      },
      { 
        id: "2d", 
        text: "Take your phone for a long session", 
        points: { "proud": 3, "casual": 2, "regular": 1, "nervous": 0 } 
      }
    ]
  },
  {
    id: 3,
    question: "Your ideal bathroom environment is...",
    options: [
      { 
        id: "3a", 
        text: "Private, quiet, and alone", 
        points: { "nervous": 3, "regular": 2, "casual": 1, "proud": 0 } 
      },
      { 
        id: "3b", 
        text: "Clean and well-stocked", 
        points: { "regular": 3, "proud": 2, "casual": 1, "nervous": 0 } 
      },
      { 
        id: "3c", 
        text: "Anywhere will do in an emergency", 
        points: { "casual": 4, "nervous": 2, "regular": 0, "proud": 0 } 
      },
      { 
        id: "3d", 
        text: "Your throne room with all the amenities", 
        points: { "proud": 4, "regular": 1, "casual": 0, "nervous": 0 } 
      }
    ]
  },
  {
    id: 4,
    question: "After a successful mission, you feel...",
    options: [
      { 
        id: "4a", 
        text: "Relieved it's over", 
        points: { "nervous": 3, "casual": 2, "regular": 1, "proud": 0 } 
      },
      { 
        id: "4b", 
        text: "Satisfied with a job well done", 
        points: { "proud": 4, "regular": 2, "casual": 0, "nervous": 0 } 
      },
      { 
        id: "4c", 
        text: "Ready to get back to your day", 
        points: { "regular": 3, "casual": 2, "proud": 1, "nervous": 0 } 
      },
      { 
        id: "4d", 
        text: "Like sharing the experience", 
        points: { "proud": 3, "casual": 1, "nervous": 0, "regular": 0 } 
      }
    ]
  },
  {
    id: 5,
    question: "When it comes to bathroom talk, you are...",
    options: [
      { 
        id: "5a", 
        text: "Extremely private - never discuss it", 
        points: { "nervous": 4, "regular": 1, "casual": 0, "proud": 0 } 
      },
      { 
        id: "5b", 
        text: "Matter-of-fact - it's natural", 
        points: { "regular": 3, "casual": 2, "proud": 1, "nervous": 0 } 
      },
      { 
        id: "5c", 
        text: "Comfortable joking about it", 
        points: { "casual": 3, "proud": 2, "regular": 1, "nervous": 0 } 
      },
      { 
        id: "5d", 
        text: "The group's poop story champion", 
        points: { "proud": 4, "casual": 1, "regular": 0, "nervous": 0 } 
      }
    ]
  }
];

const personalityTypes: Record<string, PersonalityType> = {
  "regular": {
    id: "regular",
    title: "The Clockwork Commander",
    emoji: "⏰",
    description: "You're all about routine and regularity. Your bathroom habits are as reliable as the sunrise. You appreciate efficiency and take pride in your consistent schedule.",
    healthTip: "Your regularity is great for gut health! Consider adding more fiber-rich foods to maintain your impressive schedule."
  },
  "nervous": {
    id: "nervous",
    title: "The Shy Pooper",
    emoji: "🙈",
    description: "For you, privacy is paramount. You prefer your home bathroom and may experience anxiety in public facilities. You're not one to discuss bathroom matters openly.",
    healthTip: "Holding it in too long can cause discomfort. Try deep breathing exercises to relax when using public facilities."
  },
  "proud": {
    id: "proud",
    title: "The Throne Enthusiast",
    emoji: "👑",
    description: "You take pride in your bathroom accomplishments and aren't afraid to celebrate them! Your toilet time is quality time, and you might even announce your achievements.",
    healthTip: "While your confidence is admirable, spending too long sitting can lead to hemorrhoids. Try to keep sessions under 10 minutes."
  },
  "casual": {
    id: "casual",
    title: "The Go-With-The-Flow Goer",
    emoji: "🌊",
    description: "Adaptable and easygoing, you handle bathroom matters with a casual attitude. You're not picky about when and where, and you take life's digestive ups and downs in stride.",
    healthTip: "Your adaptability is great, but pay attention to changes in your patterns as they can indicate health changes."
  }
};

interface PersonalityQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (personalityType: PersonalityType) => void;
}

export default function PersonalityQuiz({ isOpen, onClose, onComplete }: PersonalityQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<PersonalityType | null>(null);
  
  const handleAnswer = () => {
    if (selectedOption) {
      // Save the answer
      setAnswers({
        ...answers,
        [currentQuestionIndex]: selectedOption
      });
      
      // Move to next question or calculate result
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        // Calculate result
        const scores: Record<string, number> = {
          "regular": 0,
          "nervous": 0,
          "proud": 0,
          "casual": 0
        };
        
        // Calculate scores for each personality type
        Object.entries(answers).forEach(([questionIndex, optionId]) => {
          const question = quizQuestions[Number(questionIndex)];
          const option = question.options.find(opt => opt.id === optionId);
          
          if (option) {
            Object.entries(option.points).forEach(([personality, points]) => {
              scores[personality] += points;
            });
          }
        });
        
        // Add final question's answer
        const finalQuestion = quizQuestions[currentQuestionIndex];
        const finalOption = finalQuestion.options.find(opt => opt.id === selectedOption);
        if (finalOption) {
          Object.entries(finalOption.points).forEach(([personality, points]) => {
            scores[personality] += points;
          });
        }
        
        // Find highest score
        let highestScore = 0;
        let personalityResult = "regular";
        
        Object.entries(scores).forEach(([personality, score]) => {
          if (score > highestScore) {
            highestScore = score;
            personalityResult = personality;
          }
        });
        
        // Set result
        setResult(personalityTypes[personalityResult]);
        onComplete(personalityTypes[personalityResult]);
      }
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setResult(null);
  };
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-t-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-secondary">
              {result ? "Your Poop Personality" : "Poop Personality Quiz"}
            </DialogTitle>
            <DialogClose className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
              <X size={20} />
            </DialogClose>
          </div>
        </DialogHeader>
        
        {!result ? (
          <div>
            <div className="mb-4">
              <div className="flex justify-center mb-2">
                <div className="flex gap-1">
                  {quizQuestions.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-2 w-8 rounded-full ${index === currentQuestionIndex ? 'bg-primary' : index < currentQuestionIndex ? 'bg-primary/50' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
            </div>
            
            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 mb-3 p-3 border rounded-lg hover:bg-primary/10">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
            
            <Button 
              className="w-full mt-4" 
              onClick={handleAnswer}
              disabled={!selectedOption}
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          </div>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-center mb-2">
                <span className="text-5xl">{result.emoji}</span>
              </div>
              <CardTitle className="text-center text-xl">{result.title}</CardTitle>
              <CardDescription className="text-center">Your Poop Personality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{result.description}</p>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-sm font-semibold">Health Tip:</p>
                <p className="text-sm">{result.healthTip}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={resetQuiz}
              >
                Take Quiz Again
              </Button>
            </CardFooter>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}