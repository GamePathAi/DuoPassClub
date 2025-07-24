import React, { useState } from 'react';

interface TutorialModalProps {
  onFinish: () => void;
}

const slides = [
  {
    title: 'Explore Experiências Únicas',
    description: 'Navegue por uma vasta gama de ofertas e descubra novas experiências na sua cidade.',
    // icon: '🎉'
  },
  {
    title: 'Adquira Vouchers Facilmente',
    description: 'Compre vouchers para suas ofertas favoritas com segurança e rapidez.',
    // icon: '💳'
  },
  {
    title: 'Resgate e Aproveite',
    description: 'Apresente seu voucher no estabelecimento parceiro e desfrute de momentos incríveis.',
    // icon: '📱'
  },
  {
    title: 'Conecte-se e Compartilhe',
    description: 'Use o DUO PASS Connect para interagir com outros membros e compartilhar suas experiências.',
    // icon: '💬'
  }
];

const TutorialModal: React.FC<TutorialModalProps> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Como usar o Duo Pass</h2>
        <div className="mb-6">
          <p className="text-xl mb-4">{slides[currentSlide].icon}</p>
          <h3 className="font-semibold text-lg text-gray-800 mb-2">{slides[currentSlide].title}</h3>
          <p className="text-gray-600">{slides[currentSlide].description}</p>
        </div>

        <div className="flex justify-center items-center space-x-2 mb-6">
          {slides.map((_, index) => (
            <div key={index} className={`h-2 w-2 rounded-full ${currentSlide === index ? 'bg-[#FF6B35]' : 'bg-gray-300'}`}></div>
          ))}
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleNext}
            className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold py-2 px-4 rounded-lg transition-colors">
            {currentSlide < slides.length - 1 ? 'Próximo' : 'Começar a Usar'}
          </button>
          <button 
            onClick={onFinish}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
            Pular Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;