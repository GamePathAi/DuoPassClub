import React from 'react';
import { Users, Briefcase, Ticket, BarChart2 } from 'lucide-react';
import StatsCard from '../../components/Admin/StatsCard';
import DataTable from '../../components/Admin/DataTable';

export default function AdminDashboard() {
  // Mock data - replace with API calls
  const stats = [
    { title: 'Total Users', value: '1,250', icon: Users, trend: { value: 5.4, isPositive: true }, color: 'blue' },
    { title: 'Active Offers', value: '78', icon: Briefcase, trend: { value: 2.1, isPositive: false }, color: 'purple' },
    { title: 'Vouchers Generated (Month)', value: '4,321', icon: Ticket, trend: { value: 12.8, isPositive: true }, color: 'green' },
    { title: 'Engagement Rate', value: '63%', icon: BarChart2, trend: { value: 1.5, isPositive: true }, color: 'orange' },
  ];

  const recentUsersHeaders = ['Name', 'Email', 'Join Date', 'Status'];
  const recentUsersData = [
    ['John Doe', 'john.d@example.com', '2023-10-26', <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>],
    ['Jane Smith', 'jane.s@example.com', '2023-10-25', <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>],
    ['Sam Wilson', 'sam.w@example.com', '2023-10-24', <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>],
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <DataTable title="Recent Users" headers={recentUsersHeaders} data={recentUsersData} />
      </div>
    </div>
  );
}