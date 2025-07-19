import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from "../../lib/supabase";
import DataTable from '../../components/Admin/DataTable';
import { Edit, Trash2, PlusCircle, ToggleLeft, ToggleRight, Image as ImageIcon } from 'lucide-react';

// Definição de tipo para a oferta
interface Offer {
  id: string;
  title: string;
  category: string;
  is_active: boolean;
  original_value: number;
  image_url: string;
  created_at: string;
}

// Componente de Modal para Criar/Editar Oferta
const OfferModal = ({ isOpen, onClose, onSave, offer }) => {
  const [formData, setFormData] = useState(offer || {});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFormData(offer || {});
  }, [offer]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('offers-images').upload(fileName, file);

    if (error) {
      alert('Erro no upload da imagem.');
      console.error(error);
    } else {
      const { publicURL } = supabase.storage.from('offers-images').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, image_url: publicURL }));
    }
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">{offer ? 'Editar Oferta' : 'Criar Nova Oferta'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title || ''} onChange={handleInputChange} placeholder="Título" className="w-full p-2 border rounded" required />
          <input name="category" value={formData.category || ''} onChange={handleInputChange} placeholder="Categoria" className="w-full p-2 border rounded" required />
          <input name="original_value" type="number" value={formData.original_value || ''} onChange={handleInputChange} placeholder="Valor Original" className="w-full p-2 border rounded" required />
          <div className="flex items-center space-x-2">
            <label>Imagem:</label>
            <input type="file" onChange={handleFileChange} accept="image/*" className="p-2 border rounded" />
            {isUploading && <p>Enviando...</p>}
            {formData.image_url && <img src={formData.image_url} alt="Preview" className="h-16 w-16 object-cover rounded" />}
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active || false} onChange={handleInputChange} className="mr-2" />
            <label htmlFor="is_active">Ativa</label>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function OffersManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchOffers = async () => {
    setLoading(true);
    let query = supabase.from('offers').select('*');
    if (categoryFilter !== 'all') query = query.eq('category', categoryFilter);
    if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) console.error('Error fetching offers:', error);
    else setOffers(data as Offer[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, [searchTerm, categoryFilter]);

  const handleSaveOffer = async (offerData) => {
    const { id, ...updateData } = offerData;
    const request = id 
      ? supabase.from('offers').update(updateData).eq('id', id)
      : supabase.from('offers').insert([updateData]);

    const { error } = await request;
    if (error) alert('Erro ao salvar oferta.');
    else {
      fetchOffers();
      setIsModalOpen(false);
      setEditingOffer(null);
    }
  };

  const handleDelete = async (offerId: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta oferta?')) {
      const { error } = await supabase.from('offers').delete().eq('id', offerId);
      if (error) alert('Erro ao deletar oferta.');
      else fetchOffers();
    }
  };

  const handleStatusToggle = async (offer: Offer) => {
    const { error } = await supabase.from('offers').update({ is_active: !offer.is_active }).eq('id', offer.id);
    if (error) alert('Erro ao atualizar status.');
    else fetchOffers();
  };

  const tableData = useMemo(() => offers.map(offer => [
    <img src={offer.image_url} alt={offer.title} className="h-12 w-12 object-cover rounded" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/150'}/>,
    offer.title,
    offer.category,
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {offer.is_active ? 'Ativa' : 'Inativa'}
    </span>,
    `R$ ${offer.original_value.toFixed(2)}`,
    new Date(offer.created_at).toLocaleDateString(),
    <div className="flex items-center space-x-2">
      <button onClick={() => { setEditingOffer(offer); setIsModalOpen(true); }} className="text-blue-500"><Edit size={18} /></button>
      <button onClick={() => handleDelete(offer.id)} className="text-red-500"><Trash2 size={18} /></button>
      <button onClick={() => handleStatusToggle(offer)} className={offer.is_active ? 'text-green-500' : 'text-red-500'}>
        {offer.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
      </button>
    </div>
  ]), [offers]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Gestão de Ofertas</h2>
        <button onClick={() => { setEditingOffer(null); setIsModalOpen(true); }} className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          <PlusCircle size={18} className="mr-2"/>
          Nova Oferta
        </button>
      </div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Buscar por título..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 border rounded w-full" />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="p-2 border rounded w-full">
          <option value="all">Todas as Categorias</option>
          {/* Popular categorias dinamicamente seria o ideal */}
          <option value="Restaurante">Restaurante</option>
          <option value="Beleza">Beleza</option>
          <option value="Serviços">Serviços</option>
        </select>
      </div>
      {loading ? <p>Carregando...</p> : <DataTable title={`${offers.length} Ofertas Encontradas`} headers={['Imagem', 'Título', 'Categoria', 'Status', 'Valor', 'Criação', 'Ações']} data={tableData} />}
      <OfferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveOffer} offer={editingOffer} />
    </div>
  );
}