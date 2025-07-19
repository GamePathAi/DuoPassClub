import React from 'react';
import { X } from 'lucide-react';

type OfferType = 'offer' | 'experience';

interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  price_original: number;
  image_url?: string;
}

interface OfferModalProps {
  offer: Offer | null;
  isOpen: boolean;
  onClose: () => void;
  type: OfferType;
}

const OfferModal: React.FC<OfferModalProps> = ({ offer, isOpen, onClose, type }) => {
  if (!isOpen || !offer) return null;

  const modalColor = type === 'offer' ? 'blue' : 'purple';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full m-4 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">{offer.title}</h2>
        {offer.image_url ? (
          <img 
            src={offer.image_url} 
            alt={offer.title} 
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md mb-4">
            <p className="text-gray-500">Imagem não disponível</p>
          </div>
        )}
        <p className="text-gray-700 mb-4">{offer.description}</p>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-500">{offer.category}</span>
          <span className={`font-bold text-${modalColor}-600 text-xl`}>CHF {offer.price_original}</span>
        </div>
        <button 
          className={`w-full py-3 rounded-lg text-white bg-${modalColor}-500 hover:bg-${modalColor}-600`}
        >
          Resgatar Voucher
        </button>
      </div>
    </div>
  );
};

export default OfferModal;