import React from "react";
import { cn } from "@/utils/functions";

export interface InfoItem {
  title: string;
  description: string | number;
  icon: React.ReactNode;
  className?: string;
  variant: string;
}

export interface InfoProps {
  items: InfoItem[];
  className?: string;
}

const Info: React.FC<InfoProps> = ({ items, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 fl-gap-3/5", className)}>
      {items.map((item: InfoItem, index: number) => (
        <div key={index} className={cn("rounded-box p-4 hover-scale bg-white border border-base-300 text-left", item.className)}>
          <div className="flex items-center">
            <div className={cn("p-3 rounded-full bg-gradient-to-br text-white mr-4 fl-text-lg/xl", item.variant)}>{item.icon}</div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
              <p className={cn("text-2xl font-bold bg-gradient-to-r gradient-text", item.variant)}>{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Info;
