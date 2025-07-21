import { useState, useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TermsModalProps {
  onAccept: () => void;
}

export default function TermsModal({ onAccept }: TermsModalProps) {
  const context = useContext(LanguageContext);
  const { t } = context || { t: (key: string) => key }; // Fallback se context for undefined
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [commsAccepted, setCommsAccepted] = useState(false);

  const canProceed = termsAccepted && privacyAccepted;

  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleReject = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('terms.title')}</h2>
        <div className="space-y-4 text-sm text-gray-600 max-h-[80vh] overflow-y-auto pr-2">  // Aumentei max-h para 96 para acomodar mais conteúdo
          <p className="whitespace-pre-line">{t('terms.last_update')}</p>
          <p className="whitespace-pre-line">{t('terms.effective')}</p>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section1')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section2')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section3')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section4')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section5')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section6')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section7')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section8')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section9')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section10')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section11')}
          </div>
          
          <div className="whitespace-pre-line mb-4">
            {t('terms.section12')}
          </div>
          <div className="whitespace-pre-line mb-4">
            {t('terms.section13')}
          </div>
        </div>
        <div className="space-y-4 mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2"
            />
            {t('terms.accept_terms')}
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mr-2"
            />
            {t('terms.accept_privacy')}
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={commsAccepted}
              onChange={(e) => setCommsAccepted(e.target.checked)}
              className="mr-2"
            />
            {t('terms.accept_comms')}
          </label>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            {t('terms.reject_exit')}
          </button>
          <button
            onClick={onAccept}
            disabled={!canProceed}
            className={`px-4 py-2 rounded text-white ${canProceed ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {t('terms.accept_proceed')}
          </button>
        </div>
      </div>
    </div>
  );
}