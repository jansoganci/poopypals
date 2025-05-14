import { Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 p-4 bg-background rounded-b-xl shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">💩</span>
          <h1 className="text-secondary text-2xl font-bold">Poopy Pals</h1>
        </div>
        <button className="p-2 text-secondary rounded-full hover:bg-primary/20">
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
}
