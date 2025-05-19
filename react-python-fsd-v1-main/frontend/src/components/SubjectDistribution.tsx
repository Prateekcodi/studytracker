import React from 'react';

interface SubjectDistributionProps {
  data: {
    subject: string;
    totalMinutes: number;
  }[];
}

const SubjectDistribution: React.FC<SubjectDistributionProps> = ({ data }) => {
  // Color mapping for subjects
  const subjectColors: Record<string, string> = {
    'Mathematics': 'bg-indigo-500',
    'Physics': 'bg-teal-500',
    'Computer Science': 'bg-purple-500',
    'Literature': 'bg-amber-500',
    'History': 'bg-red-500',
    'Chemistry': 'bg-green-500',
  };
  
  // Calculate total time for percentage calculation
  const totalMinutes = data.reduce((sum, item) => sum + item.totalMinutes, 0);
  
  // Format function for minutes
  const formatMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      {data.length > 0 ? (
        <>
          {/* Pie chart (simplified with stacked bars) */}
          <div className="h-32 w-32 mx-auto relative rounded-full overflow-hidden mb-4">
            {data.map((item, index, arr) => {
              const percentage = (item.totalMinutes / totalMinutes) * 100;
              let rotation = 0;
              
              // Calculate rotation based on previous segments
              for (let i = 0; i < index; i++) {
                rotation += (arr[i].totalMinutes / totalMinutes) * 360;
              }
              
              return (
                <div 
                  key={item.subject}
                  className={`absolute inset-0 ${subjectColors[item.subject] || 'bg-gray-500'}`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${percentage >= 50 ? '100% 0%, 100% 100%, 0% 100%, 0% 0%,' : ''} 50% 0%)`,
                    transform: `rotate(${rotation}deg)`,
                  }}
                ></div>
              );
            })}
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold">{data.length} subjects</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex-1 overflow-auto">
            <div className="space-y-3">
              {data.map((item) => {
                const percentage = Math.round((item.totalMinutes / totalMinutes) * 100);
                
                return (
                  <div key={item.subject} className="flex items-center">
                    <div className={`w-3 h-3 rounded-sm ${subjectColors[item.subject] || 'bg-gray-500'} mr-2`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate" title={item.subject}>
                          {item.subject}
                        </span>
                        <span className="text-gray-500">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                        <div 
                          className={`${subjectColors[item.subject] || 'bg-gray-500'} h-1.5 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {formatMinutes(item.totalMinutes)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No study data available</p>
        </div>
      )}
    </div>
  );
};

export default SubjectDistribution;