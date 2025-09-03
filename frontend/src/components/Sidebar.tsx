import React, { useState } from 'react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  link: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      link: '#'
    }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">E</span>
          <span className="logo-text">Energy Dashboard</span>
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          <span className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="nav-item">
            <a href={item.link} className="nav-link">
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
