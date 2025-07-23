import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ActiveVoucherProps {
  voucherId: string;
  voucherCode: string;
  businessName: string;
  expiresAt: string;
  onView?: () => void;
}

const ActiveVoucher: React.FC<ActiveVoucherProps> = ({
  voucherId,
  voucherCode,
  businessName,
  expiresAt,
  onView
}) => {
  const navigate = useNavigate();

  const handleViewVoucher = () => {
    if (onView) {
      onView();
    } else {
      navigate(`/voucher/${voucherId}/active`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{businessName}</h3>
          <p className="text-sm text-gray-600">Código: {voucherCode}</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Ativo
          </span>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>Válido até: {new Date(expiresAt).toLocaleDateString()}</span>
      </div>
      
      <button
        onClick={handleViewVoucher}
        className="w-full bg-[#C91F1F] text-white py-2 rounded hover:bg-[#B01B1B] transition-colors"
      >
        Ver Voucher
      </button>
    </div>
  );
};

export default ActiveVoucher;