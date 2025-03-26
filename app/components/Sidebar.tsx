'use client'
import { useState, ReactNode } from "react";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

interface SidebarProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Stylish Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 z-20 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-500 focus:outline-none transition-all duration-300 ${
          isSidebarOpen ? "left-64" : "left-4"
        }`}
      >
        {isSidebarOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 text-white transition-all duration-300 min-h-screen p-5 pt-16 relative`}
      >
        {/* Dashboard Title */}
        {isSidebarOpen && (
          <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        )}

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-6">
            <li className="flex items-center gap-2">
              <span>🏠</span>
              {isSidebarOpen && (
                <Link href="/" className="hover:text-gray-300 transition-colors">
                  Home
                </Link>
              )}
            </li>
            <li className="flex items-center gap-2">
              <span>➕</span>
              {isSidebarOpen && (
                <Link href="/customer/addCustomer" className="hover:text-gray-300 transition-colors">
                  Add Customer
                </Link>
              )}
            </li>
            <li className="flex items-center gap-2">
              <span>👥</span>
              {isSidebarOpen && (
                <Link href="/customer" className="hover:text-gray-300 transition-colors">
                  All Customers
                </Link>
              )}
            </li>
            <li className="flex items-center gap-2">
              <span>📝</span>
              {isSidebarOpen && (
                <Link href="/salesorder/create" className="hover:text-gray-300 transition-colors">
                  Create Sale Order
                </Link>
              )}
            </li>
            <li className="flex items-center gap-2">
              <span>📄</span>
              {isSidebarOpen && (
                <Link href="/salesorder/list" className="hover:text-gray-300 transition-colors">
                  View Sale Orders
                </Link>
              )}
            </li>
            <li className="flex items-center gap-2">
              <span>🔄</span>
              {isSidebarOpen && (
                <Link href="/salesorder/stage" className="hover:text-gray-300 transition-colors">
                  Track Order Stage
                </Link>
              )}
            </li>
            <li className="flex items-center gap-2">
              <span>📊</span>
              {isSidebarOpen && (
                <Link href="/salesorder/report" className="hover:text-gray-300 transition-colors">
                  View Reports
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default SidebarLayout;
