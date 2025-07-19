import React, { useState } from 'react';

interface TutorialModalProps {
  onFinish: () => void;
}

const tutorialSlides = [
  {
    title: 'Explore Experiências Únicas',
    content: 'Navegue por nossa seleção de ofertas e resgate vouchers para restaurantes, spas, e muito mais.',
    // icon: '🎁'
  },
  {
    title: 'Use seus Vouchers Facilmente',
    content: 'Apresente o QR Code do seu voucher no estabelecimento para aproveitar sua experiência.',
    // icon: '📱'
  },
  {
    title: 'Conecte-se com a Comunidade',
    content: 'Participe de nosso chat exclusivo para membros e descubra dicas e novas conexões.',
    // icon: '💬'
  },
  {
    title: 'Tudo Pronto!',
    content: 'Você está pronto para começar a usar o Duo Pass Club. Aproveite ao máximo!',
    // icon: '🚀'
  },
];

export default function TutorialModal({ onFinish }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === tutorialSlides.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onFinish();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const slide = tutorialSlides[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm m-4 text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{slide.title}</h2>
        <p className="text-gray-600 mb-8">{slide.content}</p>
        
        <div className="flex justify-center mb-8">
          {tutorialSlides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${currentStep === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleNext}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLastStep ? 'Começar a Usar' : 'Próximo'}
          </button>
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="w-full py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Pular Tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}