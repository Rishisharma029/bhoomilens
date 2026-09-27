import { User, UserRole } from '../types';
import { delay, getStoredUser, setStoredUser, apiLogin } from './api';
import { MOCK_USERS } from './mockData';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    const user = getStoredUser();
    if (user) return user;
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setStoredUser(data.user);
          return data.user;
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  },

  async loginAsPreset(presetKey: 'citizen_1' | 'citizen_2' | 'admin_1' | 'admin_2'): Promise<User> {
    const preset = MOCK_USERS[presetKey];
    if (!preset) throw new Error('Preset not found');

    // Call real API
    const realUser = await apiLogin({
      email: preset.email,
      role: preset.role
    });

    const finalUser = realUser || preset;
    setStoredUser(finalUser);
    return finalUser;
  },

  async loginCitizen(phone: string, otp: string): Promise<User> {
    const realUser = await apiLogin({
      phone,
      otp,
      role: 'CITIZEN'
    });

    if (realUser) {
      setStoredUser(realUser);
      return realUser;
    }

    // Fallback preset
    const fallback = phone.endsWith('2') ? MOCK_USERS.citizen_2 : MOCK_USERS.citizen_1;
    setStoredUser(fallback);
    return fallback;
  },

  async loginAdmin(empId: string, pin: string): Promise<User> {
    const realUser = await apiLogin({
      empId,
      pin,
      role: 'ADMIN'
    });

    if (realUser) {
      setStoredUser(realUser);
      return realUser;
    }

    // Fallback preset
    const fallback = empId.includes('502') ? MOCK_USERS.admin_2 : MOCK_USERS.admin_1;
    setStoredUser(fallback);
    return fallback;
  },

  async switchRole(targetRole: UserRole): Promise<User> {
    await delay(100);
    const user = targetRole === 'CITIZEN' ? MOCK_USERS.citizen_1 : MOCK_USERS.admin_1;
    setStoredUser(user);
    return user;
  },

  async logout(): Promise<void> {
    await delay(100);
    setStoredUser(null);
  }
};
// GOOD NIGHT EVERYONE.....
// RISHI SHARMA