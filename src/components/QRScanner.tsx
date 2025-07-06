import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, CheckCircle, XCircle, MapPin, Wifi, WifiOff } from 'lucide-react';
import { VoucherService } from '../lib/voucherService';
import { GamificationService } from '../services/gamificationService';
import { Voucher } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface QRScannerProps {
  merchantId: string;
  onClose: () => void;
  onVoucherValidated: (voucher: Voucher) => void;
}

export function QRScanner({ merchantId, onClose, onVoucherValidated }: QRScannerProps) {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; voucher?: Voucher } | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [location] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue] = useState<{ code: string; location: string; timestamp: number; userLocation?: { lat: number; lng: number } }[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Get user location
    getCurrentLocation();
    
    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Process offline queue when back online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      processOfflineQueue();
    }
  }, [isOnline, offlineQueue.length, processOfflineQueue]);
  
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Erro ao obter localização:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  };
  
  const processOfflineQueue = useCallback(async () => {
    for (const queueItem of offlineQueue) {
      try {
        await VoucherService.validateVoucher(
          queueItem.qrData,
          queueItem.merchantId,
          queueItem.location
        );
      } catch (error) {
        console.error('Erro ao processar item da fila offline:', error);
      }
    }
    setOfflineQueue([]);
  }, [offlineQueue]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error: unknown) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Use a validação manual.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const validateManualCode = async () => {
    if (!manualCode.trim() || !location.trim()) {
      alert('Por favor, preencha o código e o local.');
      return;
    }

    try {
      // Simular dados do QR code para validação manual
      const qrData = {
        code: manualCode.trim(),
        merchantId: merchantId,
        location: userLocation,
        timestamp: new Date().toISOString()
      };

      if (!isOnline) {
        // Adicionar à fila offline
        setOfflineQueue(prev => [...prev, {
          qrData: JSON.stringify(qrData),
          merchantId,
          location: location.trim()
        }]);
        
        setResult({
          success: true,
          message: '✈️ Validação salva offline. Será processada quando voltar a conexão.'
        });
        
        setTimeout(() => {
          onClose();
        }, 3000);
        return;
      }

      const result = await VoucherService.validateVoucher(
        JSON.stringify(qrData), 
        merchantId, 
        location.trim()
      );
      
      setResult(result);
      
      if (result.success && result.voucher && user) {
        // Adicionar pontos por uso de voucher
        await GamificationService.addPoints(
          user.id,
          50,
          'voucher_use',
          'Voucher utilizado com sucesso! 🎉',
          {
            voucher_id: result.voucher.id,
            merchant_id: merchantId,
            location: userLocation,
            timestamp: new Date().toISOString()
          }
        );
        
        setTimeout(() => {
          onVoucherValidated(result.voucher!);
          onClose();
        }, 2000);
      }
    } catch {
      setResult({ 
        success: false, 
        message: 'Erro ao validar código manual' 
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !location.trim()) {
      if (!location.trim()) {
        alert('Por favor, informe o local antes de fazer upload.');
      }
      return;
    }

    try {
      // Para simplificar, vamos usar um leitor de arquivo básico
      // Em produção, seria necessário uma biblioteca de leitura de QR code
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // Simular leitura do QR code da imagem
          // Em produção, usar biblioteca como jsQR
          alert('Funcionalidade de upload de imagem será implementada com biblioteca específica de QR code.');
        } catch {
          setResult({ 
            success: false, 
            message: 'Erro ao ler QR code da imagem' 
          });
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setResult({ 
        success: false, 
        message: 'Erro ao processar imagem' 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Validar Voucher</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Local da validação *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Loja Centro, Filial Shopping..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Camera Scanner */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Escanear QR Code</h3>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-orange-600">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-xs">Offline</span>
                  </div>
                )}
                {userLocation && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">GPS</span>
                  </div>
                )}
              </div>
            </div>
            
            {!isScanning ? (
              <button
                onClick={startCamera}
                disabled={!location.trim()}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Camera className="w-5 h-5" />
                {isOnline ? 'Iniciar Câmera' : 'Iniciar Câmera (Offline)'}
              </button>
            ) : (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-black rounded-lg"
                />
                <button
                  onClick={stopCamera}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Parar Câmera
                </button>
                <p className="text-sm text-gray-600 text-center">
                  Posicione o QR code na frente da câmera
                </p>
              </div>
            )}
          </div>

          {/* Manual Code Input */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Validação Manual</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Digite o código do voucher (ex: DUO-ABC-123456)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button
                onClick={validateManualCode}
                disabled={!manualCode.trim() || !location.trim()}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isOnline ? 'Validar Código' : 'Salvar Offline'}
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Upload de Imagem</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={!location.trim()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">
              Faça upload de uma foto do QR code
            </p>
          </div>

          {/* Offline Queue Status */}
          {offlineQueue.length > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 text-sm font-medium">
                📱 {offlineQueue.length} validação(ões) na fila offline
              </p>
              <p className="text-orange-600 text-xs mt-1">
                Serão processadas quando a conexão for restaurada
              </p>
            </div>
          )}
          
          {/* Result */}
          {result && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">{result.message}</p>
                {result.voucher && (
                  <p className="text-sm mt-1">
                    Cliente: {result.voucher.user?.full_name}
                  </p>
                )}
                {!isOnline && result.success && (
                  <p className="text-sm mt-1 text-orange-600">
                    🎯 +50 pontos serão creditados quando voltar online
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}