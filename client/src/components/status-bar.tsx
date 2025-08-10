export default function StatusBar() {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false
  });

  return (
    <div className="bg-white px-6 pt-3 pb-1 flex justify-between items-center text-sm font-medium">
      <span>{currentTime}</span>
      <div className="flex items-center space-x-1">
        <i className="fas fa-signal text-xs"></i>
        <i className="fas fa-wifi text-xs"></i>
        <i className="fas fa-battery-full text-xs"></i>
      </div>
    </div>
  );
}
