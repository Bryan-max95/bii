"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Shield, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../api/authService';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de verificación no encontrado.');
        return;
      }

      try {
        const data = await authService.verifyEmail(token);
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message || 'Error al verificar la cuenta.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Error de conexión con el servidor.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5F2] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8B1E1E]/10 rounded-full mb-6">
          <Shield className="w-8 h-8 text-[#8B1E1E]" />
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-[#8B1E1E] animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-gray-800">Verificando tu cuenta...</h2>
            <p className="text-gray-500">Por favor espera un momento mientras procesamos tu solicitud.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold text-gray-800">¡Cuenta Verificada!</h2>
            <p className="text-gray-500">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#8B1E1E] hover:bg-[#7A0C0C] text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center space-x-2 mt-6"
            >
              <span>IR AL LOGIN</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-gray-800">Error de Verificación</h2>
            <p className="text-gray-500">{message}</p>
            <Link to="/register" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition-all mt-6">
              VOLVER A REGISTRARSE
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
