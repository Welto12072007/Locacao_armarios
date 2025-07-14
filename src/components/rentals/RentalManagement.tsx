import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Package, Users, DollarSign, Clock, Search } from 'lucide-react';
import Layout from '../common/Layout';
import Button from '../common/Button';
import Table from '../common/Table';
import { Rental } from '../../types';
import { apiService } from '../../services/api';
import RentalForm from './RentalForm';

const RentalManagement: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState<Rental | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    overdue: 0,
    completed: 0,
    revenue: 0
  });

  useEffect(() => {
    loadRentals();
    loadStats();
  }, [currentPage, searchTerm]);

  const loadRentals = async () => {
  try {
    setLoading(true);
    const response = await apiService.getRentals(currentPage, 10, searchTerm);
    
    if (response && response.data) {
      setRentals(response.data);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / 10));
    }
  } catch (error) {
    console.error('Error loading rentals:', error);
  } finally {
    setLoading(false);
  }
};


  const loadStats = async () => {
    try {
      const response = await apiService.getRentalStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadRentals();
  };

  const getStatusBadge = (status: Rental['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Ativa' },
      overdue: { color: 'bg-red-100 text-red-800', label: 'Em Atraso' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Concluída' },
      cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelada' },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: Rental['paymentStatus']) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', label: 'Pago' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      overdue: { color: 'bg-red-100 text-red-800', label: 'Em Atraso' },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const columns = [
{
  key: 'monthly_price',
  label: 'Valor Mensal',
  render: (_value: any, row: Rental) => (
    <div className="flex items-center">
      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
      <span className="text-sm text-gray-900">{formatCurrency(row.monthly_price)}</span>
    </div>
  ),
},

    {
      key: 'student',
      label: 'Aluno',
      render: (value: any, row: Rental) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium text-xs">
                {row.students?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'N/A'}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {row.students?.name || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">
              {row.students?.email || 'N/A'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Período',
      render: (value: any, row: Rental) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          <div>
            <div className="text-sm text-gray-900">
              {formatDate(row.start_date)} - {formatDate(row.end_date)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'monthly_price',
      label: 'Valor Mensal',
      render: (value: number) => (
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-900">
            {formatCurrency(value)}
          </span>
        </div>
      ),
    },
    {
      key: 'total_amount',
      label: 'Valor Total',
      render: (value: number) => (
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(value)}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: Rental['status']) => getStatusBadge(value),
    },
    {
      key: 'payment_status',
      label: 'Pagamento',
      render: (value: Rental['paymentStatus']) => getPaymentStatusBadge(value),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (value: any, row: Rental) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => handleEdit(row)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="text-red-600 hover:text-red-700"
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRental(null);
    setShowForm(true);
  };

  const handleEdit = (rental: Rental) => {
    setEditingRental(rental);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta locação?')) {
      try {
        const response = await apiService.deleteRental(id);
        if (response.success) {
          loadRentals();
          loadStats();
        }
      } catch (error) {
        console.error('Error deleting rental:', error);
        alert('Erro ao excluir locação');
      }
    }
  };

  const handleFormSubmit = async (rentalData: any) => {
    try {
      let response;
      
      if (editingRental) {
        response = await apiService.updateRental(editingRental.id, rentalData);
      } else {
        response = await apiService.createRental(rentalData);
      }

      if (response.success) {
        setShowForm(false);
        setEditingRental(null);
        loadRentals();
        loadStats();
      } else {
        alert('Erro ao salvar locação');
      }
    } catch (error) {
      console.error('Error saving rental:', error);
      alert('Erro ao salvar locação');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRental(null);
  };

  if (showForm) {
    return (
      <Layout currentPage="rentals">
        <RentalForm
          rental={editingRental}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Layout>
    );
  }

  return (
    <Layout currentPage="rentals">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Locações</h1>
            <p className="text-gray-600">Gerencie todas as locações de armários</p>
          </div>
          <Button icon={Plus} onClick={handleAdd}>
            Nova Locação
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por observações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <Button type="submit" variant="secondary">
              Buscar
            </Button>
          </form>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Locações Ativas</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Em Atraso</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.overdue}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Receita Total</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatCurrency(stats.revenue)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Concluídas</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rentals Table */}
        <Table
          columns={columns}
          data={rentals}
          loading={loading}
          pagination={{
            currentPage,
            totalPages,
            total,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </Layout>
  );
};

export default RentalManagement;