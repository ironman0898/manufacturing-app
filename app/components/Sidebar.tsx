import Link from "next/link";
import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <nav>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/" className="block p-2 hover:bg-gray-700">
                Home
              </Link>
            </li>
            <li>
              <Link href="/tracking" className="block p-2 hover:bg-gray-700">
                Tracking
              </Link>
            </li>
            <li>
              <Link href="/reports" className="block p-2 hover:bg-gray-700">
                Reports
              </Link>
            </li>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/salesorder/create"
                  className="text-blue-500 hover:underline"
                >
                  ➕ Create Sale Order
                </Link>
              </li>
              <li>
                <Link
                  href="/salesorder/list"
                  className="text-blue-500 hover:underline"
                >
                  📋 View Sale Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/salesorder/stage"
                  className="text-blue-500 hover:underline"
                >
                  🔄 Track Sale Order Stage
                </Link>
              </li>
              <li>
                <Link
                  href="/salesorder/report"
                  className="text-blue-500 hover:underline"
                >
                  📊 View Reports
                </Link>
              </li>
            </ul>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 bg-gray-100">{children}</main>
    </div>
  );
};

export default SidebarLayout;
