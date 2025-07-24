import React, { useState, useEffect } from 'react';

interface TermsModalProps {
  onAccept: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onAccept }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [communicationsAccepted, setCommunicationsAccepted] = useState(false);

  const canProceed = termsAccepted && privacyAccepted;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo ao Duo Pass Club</h2>
        <p className="text-gray-600 mb-6">Antes de começar, por favor, leia e aceite nossos termos de serviço e política de privacidade.</p>
        
        <div className="space-y-4 flex-grow overflow-y-auto pr-4 -mr-4 mb-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Termos de Uso</h3>
            <div className="text-sm text-gray-600 space-y-2 max-h-32 overflow-y-auto">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nullam ac erat ante. Vivamus et felis nec lacus eleifend accumsan. Sed id semper sem. </p>
              <p>Integer sit amet justo nec elit efficitur aliquam. Phasellus ut felis a risus varius vestibulum. Suspendisse potenti. Proin quis mauris sit amet mi feugiat laoreet. In hac habitasse platea dictumst.</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Política de Privacidade</h3>
            <div className="text-sm text-gray-600 space-y-2 max-h-32 overflow-y-auto">
              <p>Nossa política de privacidade descreve como coletamos, usamos e compartilhamos suas informações. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="space-y-3 mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} className="h-5 w-5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]" />
              <span className="text-gray-700">Eu li e aceito os <a href="/termos-de-uso" target="_blank" className="text-[#FF6B35] hover:underline">Termos de Uso</a></span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={privacyAccepted} onChange={() => setPrivacyAccepted(!privacyAccepted)} className="h-5 w-5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]" />
              <span className="text-gray-700">Eu li e aceito a <a href="/politica-de-privacidade" target="_blank" className="text-[#FF6B35] hover:underline">Política de Privacidade</a></span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={communicationsAccepted} onChange={() => setCommunicationsAccepted(!communicationsAccepted)} className="h-5 w-5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]" />
              <span className="text-gray-700">Aceito receber comunicações e ofertas (opcional)</span>
            </label>
          </div>

          <button 
            onClick={onAccept} 
            disabled={!canProceed}
            className={`w-full font-bold py-3 px-4 rounded-lg transition-colors ${canProceed ? 'bg-[#FF6B35] hover:bg-[#E55A2B] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
            Aceitar e Prosseguir
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;