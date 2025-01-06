import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Shield, LogOut, Key, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface PasswordFormData {
  professionalId: string;
  newPassword: string;
}

interface ITPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ITAdminPanel() {
  const { professionals, updateProfessional, isITAdmin, loginIT, logoutIT, updateITPassword } = useStore();
  const [loginError, setLoginError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [password, setPassword] = useState('');

  const {
    register: registerProfessional,
    handleSubmit: handleProfessionalSubmit,
    reset: resetProfessional,
    formState: { errors: professionalErrors },
  } = useForm<PasswordFormData>();

  const {
    register: registerIT,
    handleSubmit: handleITSubmit,
    reset: resetIT,
    formState: { errors: itErrors },
  } = useForm<ITPasswordFormData>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await loginIT(password);
    if (!success) {
      setLoginError('Contraseña incorrecta');
    }
    setPassword('');
  };

  const onProfessionalPasswordSubmit = async (data: PasswordFormData) => {
    const professional = professionals.find(p => p.id === data.professionalId);
    if (professional) {
      await updateProfessional({
        ...professional,
        password: data.newPassword,
      });
      setSuccessMessage('Contraseña actualizada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      resetProfessional();
    }
  };

  const onITPasswordSubmit = async (data: ITPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      setLoginError('Las contraseñas no coinciden');
      return;
    }

    const success = await updateITPassword(data.currentPassword, data.newPassword);
    if (success) {
      setSuccessMessage('Contraseña de IT actualizada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      resetIT();
    } else {
      setLoginError('La contraseña actual es incorrecta');
    }
  };

  if (!isITAdmin) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Acceso IT</h3>
          </div>
          <form onSubmit={handleLogin} className="p-4 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Panel de Administración IT</h2>
        <button
          onClick={logoutIT}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Cerrar Sesión
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Cambiar Contraseña de Profesional</h3>
          </div>
          <form onSubmit={handleProfessionalSubmit(onProfessionalPasswordSubmit)} className="p-4 space-y-4">
            <div>
              <label htmlFor="professionalId" className="block text-sm font-medium text-gray-700">
                Profesional
              </label>
              <select
                {...registerProfessional('professionalId', { required: 'Debe seleccionar un profesional' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccionar Profesional</option>
                {professionals.map(professional => (
                  <option key={professional.id} value={professional.id}>
                    {professional.name} - {professional.department}
                  </option>
                ))}
              </select>
              {professionalErrors.professionalId && (
                <p className="mt-1 text-sm text-red-600">{professionalErrors.professionalId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <input
                type="password"
                {...registerProfessional('newPassword', { required: 'La nueva contraseña es requerida' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {professionalErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{professionalErrors.newPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Save className="h-5 w-5 mr-2" />
              Guardar Cambios
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Cambiar Contraseña IT</h3>
          </div>
          <form onSubmit={handleITSubmit(onITPasswordSubmit)} className="p-4 space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Contraseña Actual
              </label>
              <input
                type="password"
                {...registerIT('currentPassword', { required: 'La contraseña actual es requerida' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {itErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{itErrors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <input
                type="password"
                {...registerIT('newPassword', { required: 'La nueva contraseña es requerida' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {itErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{itErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                {...registerIT('confirmPassword', { required: 'Debe confirmar la nueva contraseña' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {itErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{itErrors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Save className="h-5 w-5 mr-2" />
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}