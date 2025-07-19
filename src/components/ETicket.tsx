import React from 'react';
import { Voucher } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ETicketProps {
  voucher: Voucher;
  className?: string;
}

export default function ETicket({ voucher, className = '' }: ETicketProps) {
  const isUsed = voucher.status === 'used';
  const isExpired = voucher.status === 'expired' || new Date(voucher.expires_at) < new Date();

  return (
    <div className={`relative max-w-sm mx-auto ${className}`}>
      {/* Ticket Container */}
      <div 
        className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 shadow-2xl border-4 border-red-600"
        style={{ backgroundColor: '#F6C100', borderColor: '#C91F1F' }}
      >
        {/* Status Overlay */}
        {(isUsed || isExpired) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center z-10">
            <div className="bg-white px-4 py-2 rounded-lg transform -rotate-12">
              <span className="text-red-600 font-bold text-lg">
                {isUsed ? 'UTILIZADO' : 'EXPIRADO'}
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-white font-bold text-xl mb-1 drop-shadow-lg">
            {voucher.merchant?.business_name || 'Parceiro DuoPass'}
          </h2>
          <div className="h-0.5 bg-red-600 mx-8"></div>
        </div>

        {/* Customer Info */}
        <div className="text-center mb-4">
          <p className="text-red-800 font-semibold text-lg">
            {voucher.user?.full_name || 'Cliente'}
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-xl shadow-lg">
            <img 
              src={voucher.qr_code_data} 
              alt="QR Code" 
              className="w-32 h-32"
            />
          </div>
        </div>

        {/* Validity Date */}
        <div className="text-center mb-4">
          <p className="text-red-800 font-medium">
            Válido até: {format(new Date(voucher.expires_at), 'dd/MM/yyyy', { locale: ptBR })}
          </p>
        </div>

        {/* Usage Info */}
        {voucher.used_at && (
          <div className="text-center mb-4 text-sm">
            <p className="text-red-700">
              Usado em: {format(new Date(voucher.used_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </p>
            {voucher.used_location && (
              <p className="text-red-700">
                Local: {voucher.used_location}
              </p>
            )}
          </div>
        )}

        {/* Footer with ID */}
        <div className="border-t-2 border-red-600 pt-3 mt-4">
          <p className="text-center text-red-800 font-mono text-sm font-bold">
            {voucher.voucher_code}
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 left-2 w-4 h-4 bg-red-600 rounded-full opacity-50"></div>
        <div className="absolute top-2 right-2 w-4 h-4 bg-red-600 rounded-full opacity-50"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 bg-red-600 rounded-full opacity-50"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-red-600 rounded-full opacity-50"></div>
      </div>

      {/* Ticket Perforations */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
        <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
      </div>
    </div>
  );
}