import React, { useEffect, useState } from 'react';
import { Package, Plus, Search, Edit, Trash2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'armarios' | 'students' | 'rentals';
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '#', icon: Package, current: currentPage === 'dashboard' },
    { name: 'Armários', href: '#', icon: Package, current: currentPage === 'armarios' },
    { name: 'Estudantes', href: '#', icon: Package, current: currentPage === 'students' },
    { name: 'Aluguéis', href: '#', icon: Package, current: currentPage === 'rentals' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <nav className="w-64 bg-white border-r border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <Package className="w-6 h-6" />
          LockerSys
        </h1>
        <ul className="mt-6 space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md font-medium text-sm ${
                  item.current
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-1 p-6">{children}</div>
    </div>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  icon: Icon,
  onClick,
  className = '',
  variant = 'primary',
  type = 'button',
}) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {children}
    </button>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

interface Armario {
  id?: number;
  numero: string;
  localizacao: string;
  status: string;
  observacoes: string;
}

interface ArmarioFormProps {
  armario?: Armario;
  onSubmit: (data: Armario) => void;
  onCancel: () => void;
}

const ArmarioForm: React.FC<ArmarioFormProps> = ({ armario, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Armario>({
    numero: armario?.numero || '',
    localizacao: armario?.localizacao || '',
    status: armario?.status || 'disponível',
    observacoes: armario?.observacoes || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {['numero', 'localizacao'].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium capitalize">{field}</label>
          <input
            type="text"
            name={field}
            value={(form as any)[field]}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="disponível">Disponível</option>
          <option value="alugado">Alugado</option>
          <option value="manutenção">Manutenção</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Observações</label>
        <textarea
          name="observacoes"
          value={form.observacoes}
          onChange={handleChange}
          rows={3}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};

const ArmariosManagement: React.FC = () => {
  const [armarios, setArmarios] = useState<Armario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Armario | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setArmarios([
      { id: 1, numero: '001', localizacao: 'Bloco A', status: 'disponível', observacoes: '' },
      { id: 2, numero: '002', localizacao: 'Bloco B', status: 'alugado', observacoes: '' },
      { id: 3, numero: '003', localizacao: 'Bloco C', status: 'manutenção', observacoes: 'Trava quebrada' },
    ]);
  }, []);

  const filteredArmarios = armarios.filter(
    (a) =>
      a.numero.includes(search) ||
      a.localizacao.toLowerCase().includes(search.toLowerCase())
  );

  const saveArmario = (data: Armario) => {
    if (editing) {
      setArmarios((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...data } : a))
      );
    } else {
      setArmarios((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const deleteArmario = (id: number) => {
    if (confirm('Deseja excluir este armário?')) {
      setArmarios((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <Layout currentPage="armarios">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Armários</h1>
          <p className="text-gray-600 text-sm">Gerencie os armários disponíveis</p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Novo Armário
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Número</th>
              <th className="px-4 py-2 text-left">Localização</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredArmarios.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-2">{a.numero}</td>
                <td className="px-4 py-2">{a.localizacao}</td>
                <td className="px-4 py-2 capitalize">{a.status}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button icon={Edit} variant="secondary" onClick={() => {
                    setEditing(a);
                    setShowModal(true);
                  }}>Editar</Button>
                  <Button icon={Trash2} variant="danger" onClick={() => deleteArmario(a.id!)}>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        title={editing ? 'Editar Armário' : 'Novo Armário'}
      >
        <ArmarioForm
          armario={editing || undefined}
          onSubmit={saveArmario}
          onCancel={() => {
            setShowModal(false);
            setEditing(null);
          }}
        />
      </Modal>
    </Layout>
  );
};

export default ArmariosManagement;
