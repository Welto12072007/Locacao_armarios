import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, FileText, Calendar } from 'lucide-react';
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
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadLocais();
  }, [currentPage]);

  const loadLocais = async () => {
    try {
      setLoading(true);
      const res = await apiService.getLocais(currentPage, 10);
      setLocais(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleAdd = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (data: { nome: string; descricao?: string }) => {
    try {
      await apiService.createLocal(data);
      setShowForm(false);
      loadLocais();
    } catch (error) {
      console.error('Erro ao criar local:', error);
    }
  };

  const handleEdit = (id: string) => {
    console.log('Editar local:', id);
    // Implemente depois se quiser edição
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este local?')) {
      try {
        await apiService.deleteLocal(id);
        loadLocais();
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
      render: (_: any, row: Local) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEdit(row.id)} />
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
          <Button icon={Plus} onClick={handleAdd}>
            Novo Local
          </Button>
        </div>

        {/* Formulário (quando aberto) */}
        {showForm && (
          <div className="bg-white p-4 border rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Novo Local</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const nome = (form.elements.namedItem('nome') as HTMLInputElement).value;
                const descricao = (form.elements.namedItem('descricao') as HTMLInputElement).value;
                handleFormSubmit({ nome, descricao });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  name="nome"
                  type="text"
                  required
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  name="descricao"
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabela */}
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
