'use client';
import { useEffect, useState } from 'react';

interface StageStatusCount {
  current_stage: string;
  stage_status: 'Pending' | 'Processing' | 'Completed';
  _count: { _all: number };
}

interface OverallStatusCount {
  stage_status: 'Pending' | 'Processing' | 'Completed';
  _count: { _all: number };
}

interface ReportData {
  stageStatusCounts: StageStatusCount[];
  totalAmount: number;
  overallStatusCounts: OverallStatusCount[];
}

export default function SalesReport() {
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch('/api/sales-orders/report');
        const data = await response.json();

        if (data.error) {
          alert(data.error);
        } else {
          setReportData(data);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReportData();
  }, []);

  if (!reportData) return <p>Loading report data...</p>;

  // Grouping stage-wise data for easier display
  // Grouping stage-wise data for easier display
const groupedData = reportData.stageStatusCounts.reduce(
  (acc: Record<string, { Pending: number; Processing: number; Completed: number }>, curr) => {
    if (!acc[curr.current_stage]) {
      acc[curr.current_stage] = { Pending: 0, Processing: 0, Completed: 0 };
    }

    acc[curr.current_stage][curr.stage_status as 'Pending' | 'Processing' | 'Completed'] = curr._count._all;

    return acc;
  },
  {}
);


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 w-full mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Sales Orders Report</h1>

        {/* Total Production Amount */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Total Production Amount</h2>
          <p className="text-lg font-semibold text-green-600">₹ {reportData.totalAmount.toLocaleString()}</p>
        </div>

        {/* Overall Order Status Summary */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overall Order Status Summary</h2>
        <table className="w-full bg-gray-50 border rounded-lg shadow-md mb-6">
          <thead className="bg-gradient-to-r from-blue-200 to-purple-200">
            <tr>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Count</th>
            </tr>
          </thead>
          <tbody>
            {reportData.overallStatusCounts.map((status) => (
              <tr key={status.stage_status} className="text-center hover:bg-gray-100">
                <td className="p-3 border font-semibold">{status.stage_status}</td>
                <td className="p-3 border">{status._count._all}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Stage-wise Status Summary */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Stage-wise Order Status</h2>
        <table className="w-full bg-gray-50 border rounded-lg shadow-md">
          <thead className="bg-gradient-to-r from-blue-200 to-purple-200">
            <tr>
              <th className="p-3 border">Stage</th>
              <th className="p-3 border">Pending</th>
              <th className="p-3 border">Processing</th>
              <th className="p-3 border">Completed</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([stage, counts]) => (
              <tr key={stage} className="text-center hover:bg-gray-100">
                <td className="p-3 border font-semibold">{stage}</td>
                <td className="p-3 border">{counts.Pending}</td>
                <td className="p-3 border">{counts.Processing}</td>
                <td className="p-3 border">{counts.Completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
