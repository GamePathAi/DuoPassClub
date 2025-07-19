import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CustomerServiceAgent from '../CustomerServiceAgent';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CustomerServiceAgent />
    </div>
  );
}