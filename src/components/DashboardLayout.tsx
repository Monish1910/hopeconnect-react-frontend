
import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  tabs?: { id: string; label: string; content: ReactNode }[];
  showTabs?: boolean;
  defaultTab?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  tabs,
  showTabs = false,
  defaultTab
}) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-medical-dark">{title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {showTabs && tabs && tabs.length > 0 ? (
          <Tabs defaultValue={defaultTab || tabs[0].id} className="w-full">
            <TabsList className="mb-6 bg-white border rounded-md p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-medical-blue data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
