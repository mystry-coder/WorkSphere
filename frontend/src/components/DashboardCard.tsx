import React from 'react';
import { motion } from "framer-motion";
import * as Icons from 'lucide-react';

interface DashboardCardProps {
  iconName: keyof typeof Icons;
  title: string;
  description: string;
  onClick: () => void;
  badge?: string;
  badgeColor?: string;
}

export function DashboardCard({ iconName, title, description, onClick, badge, badgeColor = 'bg-blue-100 text-blue-800' }: DashboardCardProps) {
  // Dynamically resolve icon component
  const IconComponent = Icons[iconName] as React.ComponentType<any>;

  return (
    <motion.button
      whileHover={{ y: -4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-start p-6 text-left bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200 hover:border-blue-500 cursor-pointer w-full group"
    >
      <div className="flex justify-between items-start w-full mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
          {IconComponent && <IconComponent className="w-6 h-6" />}
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
    </motion.button>
  );
}
