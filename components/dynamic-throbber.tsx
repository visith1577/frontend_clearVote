import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Brain, Database, FileText, BarChart2 } from 'lucide-react';

const stages = [
  { icon: Brain, text: 'Thinking' },
  { icon: Database, text: 'Gathering data' },
  { icon: FileText, text: 'Collecting response' },
  { icon: BarChart2, text: 'Analysing' },
];

const DynamicThrobber: React.FC<{ isVisible: boolean; onComplete: () => void }> = ({ isVisible, onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);

  const props = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
  });

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentStage((prevStage) => {
          if (prevStage === stages.length - 1) {
            clearInterval(interval);
            setTimeout(onComplete, 1000); // Delay to show the last stage
            return prevStage;
          }
          return prevStage + 1;
        });
      }, 7500); // 30 seconds / 4 stages = 7.5 seconds per stage

      return () => clearInterval(interval);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const CurrentIcon = stages[currentStage].icon;

  return (
    <animated.div style={props} className="flex flex-col items-center justify-center space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <CurrentIcon className="w-12 h-12 text-blue-500 animate-pulse" />
      <p className="text-lg font-semibold text-gray-700">{stages[currentStage].text}</p>
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
        ></div>
      </div>
    </animated.div>
  );
};

export default DynamicThrobber;