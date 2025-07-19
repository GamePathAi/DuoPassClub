import React from 'react';

export default function AdminSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Admin Settings</h2>
      <div className="mt-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">System Configuration</h3>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span>Maintenance Mode</span>
              <button className="px-3 py-1 bg-gray-200 rounded-md">Off</button>
            </div>
            <div className="flex items-center justify-between">
              <span>User Registration</span>
              <button className="px-3 py-1 bg-green-200 rounded-md">Enabled</button>
            </div>
            <div className="flex items-center justify-between">
              <span>Debug Mode</span>
              <button className="px-3 py-1 bg-gray-200 rounded-md">Off</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Email Settings</h3>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span>Notification Emails</span>
              <button className="px-3 py-1 bg-green-200 rounded-md">Enabled</button>
            </div>
            <div className="flex items-center justify-between">
              <span>Marketing Emails</span>
              <button className="px-3 py-1 bg-green-200 rounded-md">Enabled</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}