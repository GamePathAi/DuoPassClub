import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { 
  Bell, 
  Globe, 
  Shield, 
  CreditCard, 
  Smartphone, 
  Mail, 
  Trash2,
  Download
} from 'lucide-react';

interface NotificationSettings {
  email_offers: boolean;
  email_vouchers: boolean;
  email_marketing: boolean;
  push_offers: boolean;
  push_vouchers: boolean;
  push_reminders: boolean;
  sms_important: boolean;
}

interface PrivacySettings {
  profile_visibility: 'public' | 'private';
  data_sharing: boolean;
  analytics_tracking: boolean;
  location_sharing: boolean;
}

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'account' | 'preferences'>('notifications');
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_offers: true,
    email_vouchers: true,
    email_marketing: false,
    push_offers: true,
    push_vouchers: true,
    push_reminders: true,
    sms_important: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profile_visibility: 'private',
    data_sharing: false,
    analytics_tracking: true,
    location_sharing: false
  });

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    // Here you would save to backend
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    // Here you would save to backend
  };

  const handleExportData = () => {
    // Implementation for data export
    alert('Funcionalidade de exportação será implementada em breve.');
  };

  const handleDeleteAccount = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      // Implementation for account deletion
      alert('Funcionalidade de exclusão será implementada em breve.');
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
    { id: 'account', label: 'Conta', icon: CreditCard },
    { id: 'preferences', label: 'Preferências', icon: Globe }
  ];

  return (
    <DashboardLayout title="Configurações">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600">
            Personalize sua experiência no DuoPass
          </p>
        </div>

        <div className="flex flex-col">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'notifications' | 'privacy' | 'account' | 'preferences')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#C91F1F] text-[#C91F1F]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Configurações de Notificação
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Notificações por Email
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Novas Ofertas</p>
                            <p className="text-sm text-gray-500">Receba emails sobre ofertas especiais</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.email_offers}
                              onChange={(e) => handleNotificationChange('email_offers', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C91F1F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C91F1F]"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Vouchers</p>
                            <p className="text-sm text-gray-500">Confirmações e lembretes de vouchers</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.email_vouchers}
                              onChange={(e) => handleNotificationChange('email_vouchers', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C91F1F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C91F1F]"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Marketing</p>
                            <p className="text-sm text-gray-500">Novidades e promoções especiais</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.email_marketing}
                              onChange={(e) => handleNotificationChange('email_marketing', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C91F1F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C91F1F]"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Smartphone className="w-5 h-5 mr-2" />
                        Notificações Push
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Ofertas Próximas</p>
                            <p className="text-sm text-gray-500">Quando estiver perto de ofertas relevantes</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.push_offers}
                              onChange={(e) => handleNotificationChange('push_offers', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C91F1F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C91F1F]"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Lembretes de Vouchers</p>
                            <p className="text-sm text-gray-500">Antes dos vouchers expirarem</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.push_reminders}
                              onChange={(e) => handleNotificationChange('push_reminders', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C91F1F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C91F1F]"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Configurações de Privacidade
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Visibilidade do Perfil</p>
                        <p className="text-sm text-gray-500">Controle quem pode ver seu perfil</p>
                      </div>
                      <select
                        value={privacy.profile_visibility}
                        onChange={(e) => handlePrivacyChange('profile_visibility', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent"
                      >
                        <option value="public">Público</option>
                        <option value="private">Privado</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Compartilhamento de Dados</p>
                        <p className="text-sm text-gray-500">Permitir compartilhamento com parceiros</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.data_sharing}
                          onChange={(e) => handlePrivacyChange('data_sharing', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C91F1F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C91F1F]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Rastreamento de Analytics</p>
                        <p className="text-sm text-gray-500">Ajuda a melhorar nossos serviços</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.analytics_tracking}
                          onChange={(e) => handlePrivacyChange('analytics_tracking', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C91F1F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C91F1F]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Configurações da Conta
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Exportar Dados</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Baixe uma cópia de todos os seus dados
                      </p>
                      <button
                        onClick={handleExportData}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#C91F1F] text-white rounded-lg hover:bg-[#A91A1A] transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Exportar Dados</span>
                      </button>
                    </div>
                    
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h3 className="font-medium text-red-900 mb-2">Zona de Perigo</h3>
                      <p className="text-sm text-red-700 mb-4">
                        Excluir sua conta removerá permanentemente todos os seus dados
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Excluir Conta</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Preferências
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Idioma</p>
                        <p className="text-sm text-gray-500">Escolha seu idioma preferido</p>
                      </div>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'pt' | 'en' | 'fr' | 'de' | 'it' | 'es')}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent"
                      >
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Modo Escuro</p>
                        <p className="text-sm text-gray-500">Ativar tema escuro</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={(e) => setDarkMode(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C91F1F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C91F1F]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Sons</p>
                        <p className="text-sm text-gray-500">Ativar sons de notificação</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={soundEnabled}
                          onChange={(e) => setSoundEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C91F1F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C91F1F]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
}