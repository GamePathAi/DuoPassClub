import React, { useState } from 'react';

const culturalInterests = [
  'Gastronomia', 'Museus', 'Música ao Vivo', 'Teatro',
  'Cinema', 'Arte de Rua', 'História', 'Natureza e Trilhas',
  'Festivais', 'Workshops', 'Dança', 'Literatura'
];

interface TrialOnboardingModalProps {
  onComplete: (interests: string[]) => void;
}

const TrialOnboardingModal: React.FC<TrialOnboardingModalProps> = ({ onComplete }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    if (selectedInterests.length >= 3) {
      onComplete(selectedInterests);
    } else {
      alert('Por favor, selecione pelo menos 3 interesses para personalizarmos sua experiência.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full text-gray-800">
        <h2 className="text-3xl font-bold mb-4 text-center text-yellow-500">Bem-vindo à sua Golden Week!</h2>
        <p className="text-center mb-6">Para começar, nos diga o que mais te inspira. Selecione seus interesses culturais para receber recomendações personalizadas durante seus 7 dias de acesso premium.</p>
        
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {culturalInterests.map(interest => (
            <button
              key={interest}
              onClick={() => handleInterestToggle(interest)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 border-2 ${selectedInterests.includes(interest) ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-transparent border-gray-300 hover:bg-gray-100'}`}>
              {interest}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedInterests.length < 3}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200">
          Iniciar minha experiência ({selectedInterests.length}/3+)
        </button>
      </div>
    </div>
  );
};

export default TrialOnboardingModal;