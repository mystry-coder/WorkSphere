import React from 'react';
import { Calendar, CheckCircle2, UserCog, CreditCard, RefreshCw } from 'lucide-react';

interface Activity {
  id: string;
  type: 'leave' | 'profile' | 'payroll' | 'designation';
  text: string;
  time: string;
}

export function RecentActivity() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'leave',
      text: 'Leave request for July 12th approved by HR',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'profile',
      text: 'Profile contact details updated successfully',
      time: 'Yesterday',
    },
    {
      id: '3',
      type: 'payroll',
      text: 'Payroll slip for June 2026 generated and sent',
      time: '3 days ago',
    },
    {
      id: '4',
      type: 'designation',
      text: 'Manager updated designation to Senior Software Engineer',
      time: '1 week ago',
    },
  ];

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'leave':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'profile':
        return <UserCog className="w-5 h-5 text-blue-500" />;
      case 'payroll':
        return <CreditCard className="w-5 h-5 text-purple-500" />;
      case 'designation':
        return <RefreshCw className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-5">Recent Activity</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, idx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {idx !== activities.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-250"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center ring-8 ring-white">
                      {getIcon(activity.type)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-700">
                        {activity.text}
                      </p>
                    </div>
                    <div className="text-right text-xs whitespace-nowrap text-gray-400">
                      <time dateTime={activity.time}>{activity.time}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
