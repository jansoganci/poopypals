import { Button } from "@/components/ui/button";

interface LogButtonProps {
  onClick: () => void;
}

export default function LogButton({ onClick }: LogButtonProps) {
  return (
    <div className="mx-4 my-4">
      <Button 
        className="log-btn w-full py-8 px-4 bg-primary rounded-xl shadow-md hover:shadow-lg flex flex-col items-center justify-center transition duration-200 ease-in-out"
        onClick={onClick}
      >
        <span className="text-4xl mb-2">💩</span>
        <h3 className="text-secondary font-bold text-2xl mb-1">LOG IT NOW</h3>
        <p className="text-secondary/80">Track your latest achievement</p>
      </Button>
    </div>
  );
}
