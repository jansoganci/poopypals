import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { usePoopContext } from "@/context/PoopContext";
import { X, Plus, Minus } from "lucide-react";

interface LoggingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoggingForm({ isOpen, onClose }: LoggingFormProps) {
  const { addLog } = usePoopContext();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    dateTime: new Date().toISOString().slice(0, 16),
    duration: 5,
    rating: "excellent",
    notes: "",
    consistency: 4
  });
  
  const ratingOptions = [
    { value: "excellent", emoji: "🤩", label: "Excellent" },
    { value: "good", emoji: "😊", label: "Good" },
    { value: "okay", emoji: "😐", label: "Okay" },
    { value: "bad", emoji: "😣", label: "Difficult" },
  ];
  
  const handleDurationChange = (change: number) => {
    const newDuration = Math.max(1, Math.min(60, formData.duration + change));
    setFormData({...formData, duration: newDuration});
  };
  
  const handleRatingSelect = (rating: string) => {
    setFormData({...formData, rating});
  };
  
  const handleConsistencyChange = (value: number[]) => {
    setFormData({...formData, consistency: value[0]});
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addLog({
      ...formData,
      dateTime: new Date(formData.dateTime)
    });
    
    toast({
      title: "Success!",
      description: "Your achievement has been logged 🎉",
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-t-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-secondary">Log Your Business</DialogTitle>
            <DialogClose className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
              <X size={20} />
            </DialogClose>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {/* Date & Time Selector */}
          <div className="mb-4">
            <Label className="text-gray-700 mb-2 font-semibold" htmlFor="dateTime">Date & Time</Label>
            <Input 
              type="datetime-local" 
              id="dateTime" 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.dateTime}
              onChange={e => setFormData({...formData, dateTime: e.target.value})}
            />
          </div>

          {/* Duration Selector */}
          <div className="mb-4">
            <Label className="text-gray-700 mb-2 font-semibold" htmlFor="duration">Duration (minutes)</Label>
            <div className="flex items-center space-x-3">
              <Button 
                type="button" 
                variant="outline"
                className="p-3 rounded-lg text-secondary font-bold" 
                onClick={() => handleDurationChange(-1)}
              >
                <Minus size={18} />
              </Button>
              <Input 
                type="number" 
                id="duration" 
                className="w-full p-3 text-center focus:outline-none focus:ring-2 focus:ring-primary" 
                min="1" 
                max="60" 
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
              />
              <Button 
                type="button" 
                variant="outline"
                className="p-3 rounded-lg text-secondary font-bold" 
                onClick={() => handleDurationChange(1)}
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>

          {/* Quality Rating */}
          <div className="mb-4">
            <Label className="text-gray-700 mb-2 font-semibold">How was it?</Label>
            <div className="flex justify-between">
              {ratingOptions.map((option) => (
                <Button 
                  key={option.value}
                  type="button" 
                  variant="ghost"
                  className={`emoji-btn p-3 flex flex-col items-center rounded-lg ${formData.rating === option.value ? 'bg-primary/20' : 'hover:bg-gray-100'}`}
                  onClick={() => handleRatingSelect(option.value)}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="text-xs mt-1 font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div className="mb-4">
            <Label className="text-gray-700 mb-2 font-semibold" htmlFor="notes">Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
              rows={2} 
              placeholder="Any details to remember..."
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          {/* Consistency Scale - Bristol Stool Chart */}
          <div className="mb-6">
            <Label className="text-gray-700 mb-2 font-semibold">Consistency</Label>
            <div className="relative pt-1">
              <Slider 
                value={[formData.consistency]}
                min={1}
                max={7}
                step={1}
                onValueChange={handleConsistencyChange}
              />
              <div className="flex justify-between text-xs text-gray-600 px-1 mt-1">
                <span>Hard</span>
                <span>Normal</span>
                <span>Liquid</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full py-4 px-6 bg-primary text-secondary font-bold rounded-xl shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all"
          >
            <span className="text-xl">💩</span>
            <span>LOG IT NOW</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
