import { Link, useLocation } from "wouter";
import { Home, BarChart, User, Award } from "lucide-react";

export default function BottomNav() {
  const [location] = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg max-w-md mx-auto">
      <div className="flex justify-around py-2">
        <Link href="/">
          <a className={`bottom-tab p-2 text-center w-1/5 ${location === '/' ? 'active' : 'text-gray-500'}`}>
            <Home className="bottom-nav-icon mx-auto" />
            <span className="text-xs block">Home</span>
          </a>
        </Link>
        
        <Link href="/stats">
          <a className={`bottom-tab p-2 text-center w-1/5 ${location === '/stats' ? 'active' : 'text-gray-500'}`}>
            <BarChart className="bottom-nav-icon mx-auto" />
            <span className="text-xs block">Stats</span>
          </a>
        </Link>
        
        <div className="relative w-1/5">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <span className="text-2xl">💩</span>
              </button>
            </Link>
          </div>
        </div>
        
        <Link href="/rewards">
          <a className={`bottom-tab p-2 text-center w-1/5 ${location === '/rewards' ? 'active' : 'text-gray-500'}`}>
            <Award className="bottom-nav-icon mx-auto" />
            <span className="text-xs block">Rewards</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={`bottom-tab p-2 text-center w-1/5 ${location === '/profile' ? 'active' : 'text-gray-500'}`}>
            <User className="bottom-nav-icon mx-auto" />
            <span className="text-xs block">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
