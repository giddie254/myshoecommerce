// src/pages/admin/pages/AdminRealtimeAnalytics.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, Activity } from 'lucide-react';

const socket = io(); // Assumes same origin. Use URL if backend is hosted elsewhere.

const AdminRealtimeAnalytics = () => {
  const [metrics, setMetrics] = useState({
    orders: 0,
    revenue: 0,
    users: 0,
    activeUsers: 0,
  });

  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket.io');
    });

    socket.on('realtimeMetrics', (data) => {
      setMetrics(data);
      setRevenueData((prev) => [...prev.slice(-9), { time: new Date().toLocaleTimeString(), revenue: data.revenue }]);
    });

    return () => {
      socket.off('realtimeMetrics');
    };
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-text-primary dark:text-white">📈 Real-Time Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white dark:bg-background-darkSecondary">
          <CardContent className="flex items-center gap-4 p-4">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <h2 className="text-xl font-bold">{metrics.orders}</h2>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-background-darkSecondary">
          <CardContent className="flex items-center gap-4 p-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Revenue (KSh)</p>
              <h2 className="text-xl font-bold">{metrics.revenue.toLocaleString()}</h2>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-background-darkSecondary">
          <CardContent className="flex items-center gap-4 p-4">
            <Users className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h2 className="text-xl font-bold">{metrics.users}</h2>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-background-darkSecondary">
          <CardContent className="flex items-center gap-4 p-4">
            <Activity className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-500">Active Admins</p>
              <h2 className="text-xl font-bold">{metrics.activeUsers}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-background-darkSecondary p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Live Revenue Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <XAxis dataKey="time" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminRealtimeAnalytics;
