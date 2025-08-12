/*
interface BottomNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: "home", icon: "fas fa-home", label: "Home" },
  { id: "history", icon: "fas fa-history", label: "History" },
  { id: "settings", icon: "fas fa-cog", label: "Settings" },
  { id: "help", icon: "fas fa-question-circle", label: "Help" },
];

export default function BottomNavigation({ currentPage, onPageChange }: BottomNavigationProps) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-2 safe-area-inset-bottom">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`flex flex-col items-center py-2 transition-colors ios-active ${
              currentPage === item.id ? 'text-ios-blue' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <i className={`${item.icon} text-lg mb-1`}></i>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
*/
