import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminData, getCurrentAdmin } from '../services/admin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AdminContextType {
  admin: AdminData | null;
  setAdmin: (admin: AdminData | null) => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentAdmin();
        if (response.success) {
          setAdmin(response.data);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <AdminContext.Provider value={{ admin, setAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
