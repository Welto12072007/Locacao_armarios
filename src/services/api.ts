import {
  Student,
  Locker,
  Rental,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  ArmarioStats,
  Armario as ArmarioType,
  Local,
} from '../types';

class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth_token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${this.baseUrl}${endpoint}`, config);
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      console.log(`📡 Response Status: ${response.status}`, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        if (response.status === 401) {
          this.logout();
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Success:', data);
      return data;
    } catch (error) {
      console.error('💥 API request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique se o servidor está rodando.');
      }
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth_token');
    }
  }

  // Altere 'User' para um tipo existente, por exemplo 'any' ou defina o tipo correto
  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/auth/me');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Health check corrigido
  async healthCheck(): Promise<{ status: string; database: string; timestamp: string }> {
    const response = await this.request<ApiResponse<{ timestamp: string; database: string; version: string }>>('/health');
    return {
      status: response.success ? 'OK' : 'ERROR',
      database: response.data.database,
      timestamp: response.data.timestamp,
    };
  }

  async register(name: string, email: string, password: string): Promise<{ user: any; token: string }> {
    const response = await this.request<ApiResponse<{ user: any; accessToken: string }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.success) {
      localStorage.setItem('auth_token', response.data.accessToken);
      return {
        user: response.data.user,
        token: response.data.accessToken,
      };
    }

    throw new Error(response.message);
  }

  async refreshToken(): Promise<string> {
    const response = await this.request<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
      method: 'POST',
    });

    if (response.success) {
      localStorage.setItem('auth_token', response.data.accessToken);
      return response.data.accessToken;
    }

    throw new Error(response.message);
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await this.request<ApiResponse<null>>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.success) throw new Error(response.message);
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await this.request<ApiResponse<null>>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });

    if (!response.success) throw new Error(response.message);
  }

  async validateResetToken(token: string): Promise<void> {
    const response = await this.request<ApiResponse<null>>(`/auth/validate-reset-token?token=${token}`);
    if (!response.success) throw new Error(response.message);
  }

  // Users
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<any>> {
    return this.request(`/users?page=${page}&limit=${limit}`);
  }

  async getUser(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/users/${id}`);
    if (response.success) return response.data;
    throw new Error(response.message);
  }

  async updateUser(id: string, userData: any): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    if (response.success) return response.data;
    throw new Error(response.message);
  }

  async deleteUser(id: string): Promise<void> {
    const response = await this.request<ApiResponse<null>>(`/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.success) throw new Error(response.message);
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.request<ApiResponse<DashboardStats>>('/dashboard/stats');
    if (response.success) return response.data;
    throw new Error(response.message);
  }

  // Students
  async getStudents(page = 1, limit = 10): Promise<PaginatedResponse<Student>> {
    return this.request(`/students?page=${page}&limit=${limit}`);
  }

  async getStudent(id: string): Promise<Student> {
    const response = await this.request<ApiResponse<Student>>(`/students/${id}`);
    if (response.success) return response.data;
    throw new Error(response.message);
  }

  async createStudent(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Student>> {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  }

  async updateStudent(id: string, student: Partial<Student>): Promise<ApiResponse<Student>> {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    });
  }

  async deleteStudent(id: string): Promise<ApiResponse<null>> {
    return this.request(`/students/${id}`, { method: 'DELETE' });
  }

  // Lockers (Armários)
  async getArmarios(page = 1, limit = 10): Promise<PaginatedResponse<Locker>> {
    return this.request(`/armarios?page=${page}&limit=${limit}`);
  }
  async getStudentStats(): Promise<{ total: number; active: number; inactive: number }> {
    const response = await this.request<ApiResponse<{ total: number; active: number; inactive: number }>>('/students/stats');
    
    if (response.success) {
      return response.data;
    }

    throw new Error(response.message);
  }

  // Lockers
  async getArmario(id: string): Promise<Locker> {
    const response = await this.request<ApiResponse<Locker>>(`/armarios/${id}`);
    if (response.success) return response.data;
    throw new Error(response.message);
  }

  async createArmario(armario: Omit<Locker, 'id' | 'criado_em'>): Promise<ApiResponse<Locker>> {
    return this.request('/armarios', {
      method: 'POST',
      body: JSON.stringify(armario),
    });
  }

  async updateArmario(id: string, armario: Partial<Locker>): Promise<ApiResponse<Locker>> {
    return this.request(`/armarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(armario),
    });
  }

  async deleteArmario(id: string): Promise<ApiResponse<null>> {
    return this.request(`/armarios/${id}`, { method: 'DELETE' });
  }

  async getArmarioStats(): Promise<ApiResponse<ArmarioStats>> {
    return this.request('/armarios/stats');
  }

  async getArmariosDisponiveis(): Promise<ApiResponse<ArmarioType[]>> {
    return this.request('/armarios/disponiveis');
  }

  // Rentals
  }

  async getRental(id: string): Promise<Rental> {
    const response = await this.request<ApiResponse<Rental>>(`/rentals/${id}`);
    if (response.success) return response.data;
    throw new Error(response.message);
  }


async getLocais(page = 1, limit = 10): Promise<PaginatedResponse<Local>> {
  return this.request(`/locais?page=${page}&limit=${limit}`);
}

async getLocal(id: string): Promise<Local> {
  const response = await this.request<ApiResponse<Local>>(`/locais/${id}`);
  if (response.success) return response.data;
  throw new Error(response.message);
}

async createLocal(local: { nome: string; descricao?: string }): Promise<ApiResponse<Local>> {
  return this.request('/locais', {
    method: 'POST',
    body: JSON.stringify(local),
  });
}

async updateLocal(id: string, local: { nome?: string; descricao?: string }): Promise<ApiResponse<Local>> {
  return this.request(`/locais/${id}`, {
    method: 'PUT',
    body: JSON.stringify(local),
  });
}

async deleteLocal(id: string): Promise<ApiResponse<null>> {
  return this.request(`/locais/${id}`, {
    method: 'DELETE',
  });
}

}

// Exportando uma instância do ApiService
export const apiService = new ApiService();
