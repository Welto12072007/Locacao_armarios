import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, FileText, Calendar, X, Save } from 'lucide-react';
import Layout from '../common/Layout';
import Button from '../common/Button';
import Table from '../common/Table';
import { Local } from '../../types';
import { apiService } from '../../services/api';

const LocalManagement: React.FC = () => {
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState<{ nome: string; descricao?: string }>({ nome: '', descricao: '' });
  const [editandoLocal, setEditandoLocal] = useState<Local | null>(null);

  useEffect(() => {
    loadLocais();
  }, [currentPage]);

  const loadLocais = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLocais(currentPage, 10);
      setLocais(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleAdd = async () => {
    if (!formData.nome) return;
    try {
      await apiService.createLocal(formData);
      setFormData({ nome: '', descricao: '' });
      await loadLocais();
    } catch (error) {
      console.error('Erro ao criar local:', error);
    }
  };

  const handleEdit = (id: string) => {
    const local = locais.find(l => l.id === id);
    if (local) {
      setEditandoLocal(local);
      setFormData({ nome: local.nome, descricao: local.descricao });
    }
  };

  const handleSaveEdit = async () => {
    if (!editandoLocal) return;
    try {
      await apiService.updateLocal(editandoLocal.id, formData);
      setEditandoLocal(null);
      setFormData({ nome: '', descricao: '' });
      await loadLocais();
    } catch (error) {
      console.error('Erro ao editar local:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditandoLocal(null);
    setFormData({ nome: '', descricao: '' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este local?')) {
      try {
        await apiService.deleteLocal(id);
        await loadLocais();
      } catch (error) {
        console.error('Erro ao excluir local:', error);
      }
    }
  };

  const columns = [
    {
      key: 'nome',
      label: 'Nome',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'descricao',
      label: 'Descrição',
      render: (value: string) => (
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-700">{value}</span>
        </div>
      ),
    },
    {
      key: 'criado_em',
      label: 'Criado em',
      render: (value: string) => (
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-700">{formatDate(value)}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (value: any, row: Local) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => handleEdit(row.id)}
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

  return (
    <Layout currentPage="locais">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Locais</h1>
            <p className="text-gray-600">Gerencie os locais dos armários cadastrados</p>
          </div>
        </div>

        {/* Formulário de criação/edição */}
        <div className="bg-white p-4 shadow rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              placeholder="Nome do local"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              placeholder="Descrição (opcional)"
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </div>
          <div className="flex space-x-2">
            {editandoLocal ? (
              <>
                <Button icon={Save} onClick={handleSaveEdit}>
                  Salvar Alterações
                </Button>
                <Button icon={X} variant="secondary" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button icon={Plus} onClick={handleAdd}>
                Novo Local
              </Button>
            )}
          </div>
        </div>

        {/* Locais Table */}
        <Table
          columns={columns}
          data={locais}
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

export default LocalManagement;