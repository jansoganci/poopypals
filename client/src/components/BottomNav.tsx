import { useLocation } from "wouter";
import { Home, BarChart, User, Award, Bell } from "lucide-react";

export default function BottomNav() {
  const [location, navigate] = useLocation();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg max-w-md mx-auto">
      <div className="flex justify-around py-2">
        <div 
          className={`bottom-tab p-2 text-center w-1/5 cursor-pointer ${location === '/' ? 'active' : 'text-gray-500'}`}
          onClick={() => handleNavigate('/')}
        >
          <Home className="bottom-nav-icon mx-auto" />
          <span className="text-xs block">Home</span>
        </div>
        
        <div 
          className={`bottom-tab p-2 text-center w-1/5 cursor-pointer ${location === '/stats' ? 'active' : 'text-gray-500'}`}
          onClick={() => handleNavigate('/stats')}
        >
          <BarChart className="bottom-nav-icon mx-auto" />
          <span className="text-xs block">Stats</span>
        </div>
        
        <div className="relative w-1/5">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={() => handleNavigate('/')}
              className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
              <span className="text-2xl">💩</span>
            </button>
          </div>
        </div>
        
        <div 
          className={`bottom-tab p-2 text-center w-1/5 cursor-pointer ${location === '/notifications' ? 'active' : 'text-gray-500'}`}
          onClick={() => handleNavigate('/notifications')}
        >
          <Bell className="bottom-nav-icon mx-auto" />
          <span className="text-xs block">Notifications</span>
        </div>
        
        <div 
          className={`bottom-tab p-2 text-center w-1/5 cursor-pointer ${location === '/profile' ? 'active' : 'text-gray-500'}`}
          onClick={() => handleNavigate('/profile')}
        >
          <User className="bottom-nav-icon mx-auto" />
          <span className="text-xs block">Profile</span>
        </div>
      </div>
    </nav>
  );
}
