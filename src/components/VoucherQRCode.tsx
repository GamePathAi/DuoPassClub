import { useState, useEffect } from 'react';
import { X, Download, Share2, QrCode } from 'lucide-react';

interface VoucherQRCodeProps {
  voucher: {
    id: string;
    voucher_code: string;
    status: string;
    expires_at: string;
    qr_code_data?: string;
  };
  onClose: () => void;
}

export function VoucherQRCode({ voucher, onClose }: VoucherQRCodeProps) {
  const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Gerar QR Code SVG simples (em produção, usar biblioteca como qrcode)
  const generateQRCodeSVG = (data: string): string => {
    // Simulação de QR Code usando SVG
    // Em produção, usar biblioteca como 'qrcode' ou 'qr-code-generator'
    const size = 200;
    const modules = 25; // Simulação de módulos do QR
    const moduleSize = size / modules;
    
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Fundo branco
    svg += `<rect width="${size}" height="${size}" fill="white"/>`;
    
    // Gerar padrão pseudo-aleatório baseado no código
    const hash = data.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Desenhar módulos (simulação)
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        const shouldFill = (hash + i * j) % 3 === 0;
        if (shouldFill) {
          const x = i * moduleSize;
          const y = j * moduleSize;
          svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
        }
      }
    }
    
    // Cantos de posicionamento (características do QR Code)
    const cornerSize = moduleSize * 7;
    const corners = [
      { x: 0, y: 0 },
      { x: size - cornerSize, y: 0 },
      { x: 0, y: size - cornerSize }
    ];
    
    corners.forEach(corner => {
      // Quadrado externo
      svg += `<rect x="${corner.x}" y="${corner.y}" width="${cornerSize}" height="${cornerSize}" fill="black"/>`;
      // Quadrado interno branco
      svg += `<rect x="${corner.x + moduleSize}" y="${corner.y + moduleSize}" width="${cornerSize - 2 * moduleSize}" height="${cornerSize - 2 * moduleSize}" fill="white"/>`;
      // Quadrado central preto
      svg += `<rect x="${corner.x + 2 * moduleSize}" y="${corner.y + 2 * moduleSize}" width="${cornerSize - 4 * moduleSize}" height="${cornerSize - 4 * moduleSize}" fill="black"/>`;
    });
    
    svg += '</svg>';
    return svg;
  };

  useEffect(() => {
    const generateQR = async () => {
      setLoading(true);
      try {
        // Dados do QR Code
        const qrData = voucher.qr_code_data || `DUOPASS:${voucher.voucher_code}:${voucher.id}`;
        
        // Gerar SVG do QR Code
        const svg = generateQRCodeSVG(qrData);
        setQrCodeSvg(svg);
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [voucher]);

  const handleDownload = () => {
    if (!qrCodeSvg) return;

    const blob = new Blob([qrCodeSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voucher-${voucher.voucher_code}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Voucher DuoPass',
          text: `Meu voucher: ${voucher.voucher_code}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      // Fallback: copiar para clipboard
      const text = `Voucher DuoPass: ${voucher.voucher_code}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Código copiado para a área de transferência!');
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'used':
        return 'text-gray-600 bg-gray-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'used':
        return 'Usado';
      case 'expired':
        return 'Expirado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <QrCode className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">QR Code do Voucher</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Voucher Info */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {voucher.voucher_code}
            </h3>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                {getStatusText(voucher.status)}
              </span>
              <span>Expira em: {formatDate(voucher.expires_at)}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            {loading ? (
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div 
                className="w-48 h-48 border-2 border-gray-200 rounded-lg p-2 bg-white"
                dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
              />
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Como usar:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Apresente este QR Code no estabelecimento</li>
              <li>2. O comerciante irá escanear o código</li>
              <li>3. Aguarde a confirmação da validação</li>
              <li>4. Aproveite sua experiência!</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              disabled={loading || voucher.status !== 'active'}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </button>
            <button
              onClick={handleShare}
              disabled={loading || voucher.status !== 'active'}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </button>
          </div>

          {/* Warning for inactive vouchers */}
          {voucher.status !== 'active' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Este voucher não está ativo e não pode ser usado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}