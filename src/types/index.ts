export interface Armario {
  id: string;
  numero: string;
  localizacao: string;
  status: 'disponível' | 'alugado' | 'manutenção';
  observacoes?: string;
  criado_em: string;
}

export interface ArmarioStats {
  total: number;
  disponivel: number;
  alugado: number;
  manutencao: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

export interface CreateArmarioData {
  numero: string;
  localizacao: string;
  status?: 'disponível' | 'alugado' | 'manutenção';
  observacoes?: string;
}

export interface UpdateArmarioData {
  numero?: string;
  localizacao?: string;
  status?: 'disponível' | 'alugado' | 'manutenção';
  observacoes?: string;
}

// User do primeiro tipo, para Auth simples
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
}

// Tipos para componentes UI
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<any>;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// -- Tipos da segunda parte (mais detalhados para sistema completo) --

export interface CoreUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  failedLoginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  address?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  studentId: string;
  course: string;
  semester: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Locker {
  id: string;
  number: string;
  location: string;
  size: 'small' | 'medium' | 'large';
  status: 'available' | 'rented' | 'maintenance' | 'reserved';
  monthlyPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rental {
  id: string;
  lockerId: string;
  studentId: string;
  startDate: string;
  endDate: string;
  monthlyPrice: number;
  totalAmount: number;
  status: 'active' | 'overdue' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'overdue';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  locker?: Locker;
  student?: Student;
}

export interface Payment {
  id: string;
  rentalId: string;
  amount: number;
  paymentDate: string;
  method: 'cash' | 'card' | 'pix' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalLockers: number;
  availableLockers: number;
  rentedLockers: number;
  maintenanceLockers: number;
  overdueRentals: number;
  monthlyRevenue: number;
  totalStudents: number;
  activeRentals: number;
}

export interface AuthContextType {
  user: CoreUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Local {
  id: string;
  nome: string;
  descricao?: string;
  criado_em: string;
}
