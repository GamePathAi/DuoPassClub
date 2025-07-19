import React, { useState } from 'react';

// TODO: Importar o hook do AdminAuthContext

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // const { login } = useAdminAuth(); // Descomentar quando o contexto for criado

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validCredentials = [
        { email: 'admin@duopass.com', password: 'admin123' },
        { email: 'igor@duopass.com', password: 'igor123' },
        { email: 'silvia@duopass.com', password: 'silvia123' }
      ];

      const isValid = validCredentials.some(
        cred => cred.email === email && cred.password === password
      );

      if (isValid) {
        const token = btoa(`${email}:${Date.now()}`);
        localStorage.setItem('admin_token', token);
        window.location.href = '/admin';
      } else {
        setError('Credenciais inválidas!');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">DuoPass Admin</h1>
          <p className="text-gray-400">Acesso restrito para administradores.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:outline-none focus:border-red-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:outline-none focus:border-red-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:bg-red-800"
          >
            {loading ? 'Entrando...' : 'Login Seguro'}
          </button>
        </form>
      </div>
    </div>
  );
};