import React from 'react'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="flex justify-center mb-12">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-blue-900">DP</span>
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          Duo Pass Club
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Sistema de Autenticação Dupla
        </p>
        <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Começar
        </button>
      </div>
    </div>
  )
}

export default Home