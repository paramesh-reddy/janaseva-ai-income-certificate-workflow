import React, { createContext, useContext, useState, useEffect } from 'react';
import { OfficerUser } from '../types';

export const DEMO_OFFICER: OfficerUser = {
  id: 'off-001',
  name: 'K. S. Manjunath',
  nameKannada: 'ಕೆ. ಎಸ್. ಮಂಜುನಾಥ್',
  email: 'officer@janaseva.demo',
  role: 'Revenue Inspector (Grade-I)',
  roleKannada: 'ಕಂದಾಯ ನಿರೀಕ್ಷಕರು (ದರ್ಜೆ-೧)',
  kgidNumber: 'KGID-2849104',
  district: 'Bengaluru Urban / ಬೆಂಗಳೂರು ನಗರ',
  taluk: 'Bengaluru South / ಬೆಂಗಳೂರು ದಕ್ಷಿಣ',
  officeLocation: 'Kengeri Hobli Nadakacheri, Bengaluru South',
  avatarUrl: '/src/assets/images/officer_avatar_1793942944619.jpg'
};

interface AuthContextType {
  officer: OfficerUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  demoLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [officer, setOfficer] = useState<OfficerUser | null>(() => {
    const saved = localStorage.getItem('janaseva_officer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_OFFICER;
      }
    }
    // Default logged in as demo officer for immediate accessibility
    return DEMO_OFFICER;
  });

  useEffect(() => {
    if (officer) {
      localStorage.setItem('janaseva_officer', JSON.stringify(officer));
    } else {
      localStorage.removeItem('janaseva_officer');
    }
  }, [officer]);

  const login = async (email: string, password: string) => {
    // Check credentials (supports demo officer and admin)
    if (email === 'officer@janaseva.demo' && password === 'Demo@12345') {
      setOfficer(DEMO_OFFICER);
      return { success: true };
    }
    // Also allow any valid email format with Demo@12345 or password for demonstration
    if (email && (password === 'Demo@12345' || password.length >= 6)) {
      const customOfficer: OfficerUser = {
        ...DEMO_OFFICER,
        email,
        name: email.split('@')[0].toUpperCase() + ' (Officer)',
        nameKannada: 'ಅಧಿಕಾರಿ (' + email.split('@')[0] + ')'
      };
      setOfficer(customOfficer);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Please use officer@janaseva.demo / Demo@12345' };
  };

  const demoLogin = () => {
    setOfficer(DEMO_OFFICER);
  };

  const logout = () => {
    setOfficer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        officer,
        isAuthenticated: !!officer,
        login,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
