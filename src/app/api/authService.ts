// src/app/api/authService.ts - CÓDIGO CORREGIDO

// ELIMINA ESTA LÍNEA QUE CAUSA PROBLEMAS:
// export const API_URL = '/api';

export const authService = {
  async register(userData: any) {
    try {
      console.log('Enviando registro a:', '/api/auth/register'); // Para debugging
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data); // Para debugging
      
      return data;
    } catch (error) {
      console.error('Error completo:', error);
      return { 
        success: false, 
        message: 'Error de conexión con el servidor.' 
      };
    }
  },

  async login(credentials: any) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('bwp_token', data.token);
        localStorage.setItem('bwp_user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Error de conexión con el servidor.' 
      };
    }
  },

  async verifyEmail(token: string) {
    try {
      const response = await fetch(`/api/auth/verify/${token}`);
      return response.json();
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },

  async forgotPassword(email: string) {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return response.json();
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },

  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      return response.json();
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },

  async updateProfile(profileData: any) {
    const token = localStorage.getItem('bwp_token');
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (data.id) {
        localStorage.setItem('bwp_user', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },

  async getDevices() {
    const token = localStorage.getItem('bwp_token');
    try {
      const response = await fetch('/api/devices', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    } catch (error) {
      return [];
    }
  },

  async deleteDevice(id: number) {
    const token = localStorage.getItem('bwp_token');
    try {
      const response = await fetch(`/api/devices/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },

  async getIncidents() {
    const token = localStorage.getItem('bwp_token');
    try {
      const response = await fetch('/api/incidents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    } catch (error) {
      return [];
    }
  },

  logout() {
    localStorage.removeItem('bwp_token');
    localStorage.removeItem('bwp_user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const user = localStorage.getItem('bwp_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('bwp_token');
  }
};