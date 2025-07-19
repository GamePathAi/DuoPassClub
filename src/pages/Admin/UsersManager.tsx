import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from "../../lib/supabase";
import DataTable from '../../components/Admin/DataTable';
import { Eye, ToggleLeft, ToggleRight, Download } from 'lucide-react';

// Definição de tipo para o usuário, ajuste os campos conforme sua tabela 'users'
interface User {
  id: string;
  email: string;
  full_name: string;
  subscription_status: 'active' | 'inactive' | 'pending' | 'cancelled';
  created_at: string;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      let query = supabase.from('users').select('*');

      if (statusFilter !== 'all') {
        query = query.eq('subscription_status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        setError('Não foi possível carregar os usuários. Tente novamente mais tarde.');
      } else {
        setUsers(data as User[]);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [searchTerm, statusFilter]);

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const { error } = await supabase
      .from('users')
      .update({ subscription_status: newStatus })
      .eq('id', userId);

    if (error) {
      alert('Erro ao atualizar o status do usuário.');
    } else {
      setUsers(users.map(u => u.id === userId ? { ...u, subscription_status: newStatus } : u));
    }
  };
  
  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "ID,Email,Nome,Status,Data de Cadastro\n"
      + users.map(u => `${u.id},${u.email},${u.full_name},${u.subscription_status},${new Date(u.created_at).toLocaleDateString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios_duopass.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
  };

  const tableData = useMemo(() => users.map(user => [
    user.id.substring(0, 8),
    user.full_name,
    user.email,
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.subscription_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {user.subscription_status}
    </span>,
    new Date(user.created_at).toLocaleDateString(),
    <div className="flex items-center space-x-2">
      <button className="text-gray-500 hover:text-gray-700"><Eye size={18} /></button>
      <button 
        onClick={() => handleStatusToggle(user.id, user.subscription_status)}
        className={user.subscription_status === 'active' ? 'text-green-500' : 'text-red-500'}
      >
        {user.subscription_status === 'active' ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
      </button>
    </div>
  ]), [users]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Gestão de Usuários</h2>
        <button onClick={exportData} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          <Download size={18} className="mr-2"/>
          Exportar
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="pending">Pendente</option>
        </select>
      </div>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <DataTable 
          title={`${users.length} Usuários Encontrados`}
          headers={['ID', 'Nome', 'Email', 'Status', 'Cadastro', 'Ações']}
          data={tableData}
        />
      )}
    </div>
  );
}