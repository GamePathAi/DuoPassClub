import React from 'react';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

interface GoogleSignInButtonProps {
  /** Texto do botão */
  text?: string;
  /** Variante do botão */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Tamanho do botão */
  size?: 'sm' | 'md' | 'lg';
  /** Função chamada quando o login é bem-sucedido */
  onSuccess?: () => void;
  /** Função chamada quando há erro */
  onError?: (error: string) => void;
  /** Classe CSS adicional */
  className?: string;
  /** Se o botão deve ocupar toda a largura */
  fullWidth?: boolean;
}

/**
 * Componente de botão para autenticação com Google
 * Integrado com Supabase OAuth e design system do DuoPass
 */
export default function GoogleSignInButton({
  text = 'Continuar com Google',
  variant = 'outline',
  size = 'md',
  onSuccess,
  onError,
  className = '',
  fullWidth = true,
}: GoogleSignInButtonProps) {
  const { signInWithGoogle, loading, error, clearError } = useGoogleAuth();

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      await signInWithGoogle();
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na autenticação';
      onError?.(errorMessage);
    }
  };

  // Classes base do botão
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Classes de tamanho
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  // Classes de variante
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-blue-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
    outline: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 border border-gray-300 shadow-sm',
  };

  // Classes de largura
  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${className}`;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={buttonClasses}
        aria-label={text}
      >
        {loading ? (
          <>
            {/* Spinner de loading */}
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Conectando...
          </>
        ) : (
          <>
            {/* Ícone do Google */}
            <svg
              className="w-5 h-5 mr-3"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {text}
          </>
        )}
      </button>

      {/* Exibir erro se houver */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}