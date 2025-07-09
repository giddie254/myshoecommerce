import React from 'react';
import UserGrowthChart from './UserGrowthChart';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ShoppingBag, BarChart2 } from 'lucide-react';

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Stats Cards */}
      <Card className="p-4 flex items-center gap-4 shadow-md">
        <Users className="w-8 h-8 text-primary" />
        <div>
          <p className="text-sm text-gray-500">Total Users</p>
          <h4 className="text-lg font-bold">12,400</h4>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4 shadow-md">
        <ShoppingBag className="w-8 h-8 text-primary" />
        <div>
          <p className="text-sm text-gray-500">Total Orders</p>
          <h4 className="text-lg font-bold">4,835</h4>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4 shadow-md">
        <BarChart2 className="w-8 h-8 text-primary" />
        <div>
          <p className="text-sm text-gray-500">Monthly Sales</p>
          <h4 className="text-lg font-bold">KSh 934,000</h4>
        </div>
      </Card>

      {/* User Growth Chart */}
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <UserGrowthChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
