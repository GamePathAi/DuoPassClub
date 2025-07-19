import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, History, User, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabaseConfig';

interface Merchant {
  id: string;
  name: string;
  email: string;
  business_type: string;
  status: string;
}

interface Voucher {
  id: string;
  voucher_code: string;
  status: string;
  user_id: string;
  expires_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

interface VoucherValidation {
  id: string;
  voucher_id: string;
  validated_at: string;
  validation_location: string;
  notes?: string;
  voucher?: {
    voucher_code: string;
    user?: {
      full_name: string;
    };
  };
}

export default function MerchantPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [activeTab, setActiveTab] = useState<'scanner' | 'history'>('scanner');
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
    voucher?: Voucher;
  } | null>(null);
  const [validationHistory, setValidationHistory] = useState<VoucherValidation[]>([]);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Simular login do merchant (em produção, usar autenticação real)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Buscar merchant no banco
      const { data: merchantData, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('email', loginForm.email)
        .eq('status', 'active')
        .single();

      if (error || !merchantData) {
        alert('Merchant não encontrado ou inativo');
        return;
      }

      setMerchant(merchantData);
      setIsLoggedIn(true);
      localStorage.setItem('duopass_merchant', JSON.stringify(merchantData));
      
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setMerchant(null);
    localStorage.removeItem('duopass_merchant');
    setActiveTab('scanner');
    setScannerActive(false);
    setValidationResult(null);
  };

  // Verificar se há merchant logado no localStorage
  useEffect(() => {
    const savedMerchant = localStorage.getItem('duopass_merchant');
    if (savedMerchant) {
      try {
        const merchantData = JSON.parse(savedMerchant);
        setMerchant(merchantData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Erro ao carregar merchant salvo:', error);
        localStorage.removeItem('duopass_merchant');
      }
    }
  }, []);

  // Carregar histórico de validações
  const loadValidationHistory = async () => {
    if (!merchant) return;

    try {
      const { data, error } = await supabase
        .from('voucher_validations')
        .select(`
          *,
          voucher:vouchers (
            voucher_code,
            user:users (
              full_name
            )
          )
        `)
        .eq('merchant_id', merchant.id)
        .order('validated_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Erro ao carregar histórico:', error);
        return;
      }

      setValidationHistory(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  // Validar voucher
  const validateVoucher = async (voucherCode: string) => {
    if (!merchant) return;

    setLoading(true);
    try {
      // Buscar voucher
      const { data: voucher, error: voucherError } = await supabase
        .from('vouchers')
        .select(`
          *,
          user:users (
            full_name,
            email
          )
        `)
        .eq('voucher_code', voucherCode)
        .single();

      if (voucherError || !voucher) {
        setValidationResult({
          success: false,
          message: 'Voucher não encontrado'
        });
        return;
      }

      // Verificar se voucher está ativo
      if (voucher.status !== 'active') {
        setValidationResult({
          success: false,
          message: `Voucher ${voucher.status === 'used' ? 'já foi usado' : 'expirado'}`
        });
        return;
      }

      // Verificar se não expirou
      if (new Date(voucher.expires_at) < new Date()) {
        setValidationResult({
          success: false,
          message: 'Voucher expirado'
        });
        return;
      }

      // Marcar voucher como usado
      const { error: updateError } = await supabase
        .from('vouchers')
        .update({
          status: 'used',
          used_at: new Date().toISOString()
        })
        .eq('id', voucher.id);

      if (updateError) {
        console.error('Erro ao atualizar voucher:', updateError);
        setValidationResult({
          success: false,
          message: 'Erro ao validar voucher'
        });
        return;
      }

      // Registrar validação
      const { error: validationError } = await supabase
        .from('voucher_validations')
        .insert({
          voucher_id: voucher.id,
          merchant_id: merchant.id,
          validation_location: merchant.name,
          notes: `Validado via scanner QR`
        });

      if (validationError) {
        console.error('Erro ao registrar validação:', validationError);
      }

      setValidationResult({
        success: true,
        message: 'Voucher validado com sucesso!',
        voucher: voucher
      });

      // Recarregar histórico
      loadValidationHistory();

    } catch (error) {
      console.error('Erro na validação:', error);
      setValidationResult({
        success: false,
        message: 'Erro interno na validação'
      });
    } finally {
      setLoading(false);
    }
  };

  // Simular scanner QR (em produção, usar biblioteca de QR scanner)
  const startScanner = () => {
    setScannerActive(true);
    setValidationResult(null);
  };

  const stopScanner = () => {
    setScannerActive(false);
  };

  const handleManualCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (scannedCode.trim()) {
      validateVoucher(scannedCode.trim());
      setScannedCode('');
    }
  };

  // Carregar histórico quando merchant logar ou tab mudar
  useEffect(() => {
    if (isLoggedIn && merchant && activeTab === 'history') {
      loadValidationHistory();
    }
  }, [isLoggedIn, merchant, activeTab]);

  // Tela de login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Portal do Comerciante
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Faça login para validar vouchers
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email do comerciante"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Senha"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Contas de Teste:</h3>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• merchant1@duopass.com (Pizzaria Bella Vista)</div>
                <div>• merchant2@duopass.com (Spa Relaxamento Total)</div>
                <div>• merchant3@duopass.com (Barbearia Moderna)</div>
                <div className="mt-2 text-blue-500">Senha: qualquer valor (demo)</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Interface principal do merchant
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{merchant?.name}</h1>
                <p className="text-sm text-gray-500">{merchant?.business_type}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scanner'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Camera className="h-4 w-4 inline mr-2" />
              Scanner QR
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <History className="h-4 w-4 inline mr-2" />
              Histórico
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Validar Voucher</h2>
              
              {/* Scanner simulado */}
              <div className="space-y-4">
                {!scannerActive ? (
                  <button
                    onClick={startScanner}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Ativar Scanner QR
                  </button>
                ) : (
                  <div className="text-center">
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Scanner QR Ativo</p>
                      <p className="text-sm text-gray-400 mt-2">Aponte a câmera para o QR code do voucher</p>
                    </div>
                    <button
                      onClick={stopScanner}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Parar Scanner
                    </button>
                  </div>
                )}

                {/* Input manual para código */}
                <div className="border-t pt-4">
                  <form onSubmit={handleManualCode} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ou digite o código do voucher"
                      value={scannedCode}
                      onChange={(e) => setScannedCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={loading || !scannedCode.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {loading ? 'Validando...' : 'Validar'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Resultado da validação */}
            {validationResult && (
              <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                validationResult.success ? 'border-green-400' : 'border-red-400'
              }`}>
                <div className="flex items-center">
                  {validationResult.success ? (
                    <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400 mr-3" />
                  )}
                  <div>
                    <h3 className={`text-lg font-medium ${
                      validationResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validationResult.success ? 'Sucesso!' : 'Erro na Validação'}
                    </h3>
                    <p className={`text-sm ${
                      validationResult.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {validationResult.message}
                    </p>
                    {validationResult.voucher && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p><strong>Cliente:</strong> {validationResult.voucher.user?.full_name}</p>
                        <p><strong>Código:</strong> {validationResult.voucher.voucher_code}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Histórico de Validações</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {validationHistory.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  Nenhuma validação encontrada
                </div>
              ) : (
                validationHistory.map((validation) => (
                  <div key={validation.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {validation.voucher?.voucher_code}
                        </p>
                        <p className="text-sm text-gray-500">
                          Cliente: {validation.voucher?.user?.full_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">
                          {new Date(validation.validated_at).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(validation.validated_at).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    {validation.notes && (
                      <p className="mt-2 text-sm text-gray-600">{validation.notes}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}