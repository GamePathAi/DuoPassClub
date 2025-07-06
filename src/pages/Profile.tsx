import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Camera,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Check,
  AlertCircle,
  Download,
  Trash2
} from 'lucide-react';

interface ProfileData {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  user_type: 'customer' | 'merchant';
  subscription_status: string;
  created_at: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

export function Profile() {
  const { user, userProfile } = useAuth();
  
  // Estados principais
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Formulário de edição
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    birth_date: ''
  });

  // Estados dos modais
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estados de funcionalidades
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false
  });

  // Estados de loading
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Estados específicos
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  // Efeito para carregar dados do perfil
  useEffect(() => {
    if (userProfile) {
      const data: ProfileData = {
        full_name: userProfile.full_name,
        email: user?.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        birth_date: userProfile.birth_date || '',
        user_type: userProfile.user_type,
        subscription_status: userProfile.subscription_status,
        created_at: userProfile.created_at
      };
      setProfileData(data);
      setEditForm({
        full_name: data.full_name,
        phone: data.phone || '',
        address: data.address || '',
        birth_date: data.birth_date || ''
      });
      setLoading(false);
    }
  }, [user, userProfile]);

  // Efeito para limpar mensagens
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handler para iniciar edição
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handler para cancelar edição
  const handleCancel = () => {
    if (profileData) {
      setEditForm({
        full_name: profileData.full_name,
        phone: profileData.phone || '',
        address: profileData.address || '',
        birth_date: profileData.birth_date || ''
      });
    }
    setIsEditing(false);
  };

  // Handler para salvar perfil
  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      if (!editForm.full_name.trim()) {
        throw new Error('Nome completo é obrigatório');
      }
      
      if (editForm.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(editForm.phone)) {
        throw new Error('Formato de telefone inválido. Use: (11) 99999-9999');
      }
      
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone || null,
          address: editForm.address || null,
          birth_date: editForm.birth_date || null
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      if (profileData) {
        const updatedData = {
          ...profileData,
          full_name: editForm.full_name,
          phone: editForm.phone,
          address: editForm.address,
          birth_date: editForm.birth_date
        };
        setProfileData(updatedData);
      }
      
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setSaving(false);
    }
  };

  // Handler para alterar senha
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
      
      if (passwordForm.newPassword.length < 6) {
        throw new Error('A nova senha deve ter pelo menos 6 caracteres');
      }
      
      if (passwordForm.currentPassword === passwordForm.newPassword) {
        throw new Error('A nova senha deve ser diferente da atual');
      }
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handler para toggle 2FA
  const handle2FAToggle = async () => {
    setTwoFALoading(true);
    
    try {
      if (!is2FAEnabled) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setQrCode('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=');
        setShow2FAModal(true);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIs2FAEnabled(false);
        setMessage({ type: 'success', text: 'Autenticação em duas etapas desativada!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao processar solicitação' });
    } finally {
      setTwoFALoading(false);
    }
  };

  // Handler para confirmar 2FA
  const handleConfirm2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFALoading(true);
    
    try {
      if (verificationCode.length !== 6) {
        throw new Error('Código deve ter 6 dígitos');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIs2FAEnabled(true);
      setShow2FAModal(false);
      setVerificationCode('');
      setQrCode('');
      setMessage({ type: 'success', text: 'Autenticação em duas etapas ativada com sucesso!' });
      
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setTwoFALoading(false);
    }
  };

  // Handler para exportar dados
  const handleExport = async () => {
    setExportLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const data = {
      user: { email: profileData?.email, name: profileData?.full_name },
      vouchers: [{ code: 'WELCOME50', status: 'active' }],
      history: [{ action: 'voucher_used', amount: 45 }]
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duopass-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setExportLoading(false);
    setShowExportModal(false);
    setMessage({ type: 'success', text: 'Dados exportados com sucesso!' });
  };

  // Handler para excluir conta
  const handleDelete = async () => {
    if (deleteStep < 3) {
      setDeleteStep(deleteStep + 1);
      return;
    }
    
    setMessage({ type: 'success', text: 'Solicitação de exclusão processada!' });
    setShowDeleteModal(false);
    setDeleteStep(1);
    setDeleteConfirmation('');
  };

  // Funções utilitárias
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getSubscriptionBadge = (status: string) => {
    const isActive = status === 'active';
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${
          isActive ? 'bg-green-500' : 'bg-yellow-500'
        }`} />
        {isActive ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  // Estados de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] py-8 pt-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-lg p-6">
              <div className="h-24 bg-gray-300 rounded-full w-24 mx-auto mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] py-8 pt-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar perfil
            </h2>
            <p className="text-gray-600">
              Não foi possível carregar as informações do perfil.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] py-8 pt-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header do Card */}
          <div className="bg-gradient-to-r from-[#F6C100] to-[#C91F1F] px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-600" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                    <Camera className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{profileData.full_name}</h2>
                  <p className="opacity-90 capitalize">
                    {profileData.user_type === 'merchant' ? 'Comerciante' : 'Cliente'}
                  </p>
                  <div className="mt-2">
                    {getSubscriptionBadge(profileData.subscription_status)}
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar</span>
                </button>
              )}
            </div>
          </div>

          {/* Conteúdo do Card */}
          <div className="p-6">
            {/* Mensagens de Feedback */}
            {message.text && (
              <div className={`p-4 rounded-lg mb-6 flex items-center space-x-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {isEditing ? (
              /* Formulário de Edição */
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Rua, número, bairro, cidade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={editForm.birth_date}
                    onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent"
                  />
                </div>

                {/* Botões de Ação */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 bg-[#C91F1F] text-white px-4 py-2 rounded-lg hover:bg-[#A91A1A] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Salvar</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Modo de Visualização */
              <div className="space-y-6">
                {/* Informações do Perfil */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{profileData.email}</p>
                    </div>
                  </div>

                  {profileData.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium text-gray-900">{profileData.phone}</p>
                      </div>
                    </div>
                  )}

                  {profileData.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Endereço</p>
                        <p className="font-medium text-gray-900">{profileData.address}</p>
                      </div>
                    </div>
                  )}

                  {profileData.birth_date && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Data de Nascimento</p>
                        <p className="font-medium text-gray-900">{formatDate(profileData.birth_date)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Membro desde</p>
                      <p className="font-medium text-gray-900">{formatDate(profileData.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Seção de Segurança */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Segurança da Conta
                  </h3>
                  <div className="space-y-3">
                    {/* Botão Alterar Senha */}
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-gray-500" />
                        <div className="text-left">
                          <div className="font-medium">Alterar Senha</div>
                          <div className="text-sm text-gray-500">
                            Última alteração há mais de 90 dias
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </button>
                    
                    {/* Botão 2FA */}
                    <button 
                      onClick={handle2FAToggle}
                      disabled={twoFALoading}
                      className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-3">
                        <Shield className={`w-5 h-5 ${is2FAEnabled ? 'text-green-500' : 'text-gray-500'}`} />
                        <div className="text-left">
                          <div className="font-medium">Autenticação em Duas Etapas</div>
                          <div className="text-sm text-gray-500">
                            {is2FAEnabled ? 'Ativada - clique para desativar' : 'Adicione uma camada extra de segurança'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {twoFALoading && (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {is2FAEnabled ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Ativo</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Inativo</span>
                        )}
                        <div className="text-gray-400">→</div>
                      </div>
                    </button>

                    {/* Botão Export Data */}
                    <button 
                      onClick={() => setShowExportModal(true)}
                      className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-gray-500" />
                        <div className="text-left">
                          <div className="font-medium">Exportar Dados</div>
                          <div className="text-sm text-gray-500">
                            Baixe todos os seus dados em formato JSON
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </button>

                    {/* Botão Danger Zone */}
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center justify-between w-full p-4 bg-white rounded-lg border border-red-200 hover:border-red-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-red-500" />
                        <div className="text-left">
                          <div className="font-medium text-red-600">Zona de Perigo</div>
                          <div className="text-sm text-red-500">
                            Excluir conta permanentemente
                          </div>
                        </div>
                      </div>
                      <div className="text-red-400">→</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Alterar Senha */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold">Alterar Senha</h2>
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {passwordLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Alterar Senha'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2FA */}
        {show2FAModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold">Configurar 2FA</h2>
                <button 
                  onClick={() => setShow2FAModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    {qrCode ? (
                      <img src={qrCode} alt="QR Code 2FA" className="w-40 h-40" />
                    ) : (
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Escaneie este QR code com seu app autenticador
                  </p>
                </div>
                
                <form onSubmit={handleConfirm2FA} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código de Verificação
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-wider"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShow2FAModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={twoFALoading || verificationCode.length !== 6}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      {twoFALoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Ativar 2FA'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Export */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-semibold">Exportar Dados</h2>
                <button onClick={() => setShowExportModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Download incluirá: perfil, vouchers, histórico e atividades
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 border border-gray-300 py-2 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={exportLoading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
                  >
                    {exportLoading ? 'Processando...' : 'Exportar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Delete */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-semibold text-red-900">Excluir Conta</h2>
                <button onClick={() => setShowDeleteModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                {deleteStep === 1 && (
                  <div>
                    <div className="bg-red-50 p-3 rounded mb-4">
                      <p className="text-sm text-red-800">
                        ⚠️ Ação irreversível! Todos os dados serão removidos.
                      </p>
                    </div>
                  </div>
                )}
                
                {deleteStep === 2 && (
                  <div>
                    <p className="text-sm mb-4">Digite <strong>EXCLUIR CONTA</strong>:</p>
                    <input
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="EXCLUIR CONTA"
                      className="w-full p-2 border rounded mb-4"
                    />
                  </div>
                )}
                
                {deleteStep === 3 && (
                  <div className="text-center">
                    <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm">Processando exclusão...</p>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 border border-gray-300 py-2 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteStep === 2 && deleteConfirmation !== 'EXCLUIR CONTA'}
                    className="flex-1 bg-red-600 text-white py-2 rounded disabled:opacity-50"
                  >
                    {deleteStep === 1 ? 'Continuar' : deleteStep === 2 ? 'Confirmar' : 'Finalizar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {message.text && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg ${
            message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;