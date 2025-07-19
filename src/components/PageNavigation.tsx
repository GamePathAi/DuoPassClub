import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PageNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isExperiencias = location.pathname === '/experiencias';

  return (
    <div className="sticky top-0 bg-white shadow-md z-10">
      <div className="container mx-auto px-4">
        <div className="flex">
          <button
            onClick={() => navigate('/experiencias')}
            className={`flex-1 py-4 text-center font-semibold ${isExperiencias ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
          >
            🎭 Experiências
          </button>
          <button
            onClick={() => navigate('/ofertas')}
            className={`flex-1 py-4 text-center font-semibold ${!isExperiencias ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            🛍️ Ofertas
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNavigation;