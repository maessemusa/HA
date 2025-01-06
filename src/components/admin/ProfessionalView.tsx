import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Bell, CheckCircle2, Users, Trash2, LogOut, History } from 'lucide-react';
import { Professional, Patient } from '../../types';
import { playNotificationSound } from '../../utils/sound';

interface LoginFormData {
  id: string;
  password: string;
}

export function ProfessionalView() {
  const { 
    patients, 
    professionals, 
    rooms, 
    updatePatient, 
    updateRoom,
    currentProfessional,
    login,
    logout
  } = useStore();

  const [loginError, setLoginError] = useState<string>('');
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    id: '',
    password: ''
  });

  const assignedRoom = currentProfessional 
    ? rooms.find(r => r.currentProfessionalId === currentProfessional.id)
    : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const success = await login(formData.id, formData.password);
    if (!success) {
      setLoginError('Credenciales inválidas');
    }
  };

  const handleCallPatient = async (patient: Patient) => {
    if (!assignedRoom) {
      alert('Este profesional no tiene un consultorio asignado');
      return;
    }

    // Play notification sound
    playNotificationSound();

    // Update previous patient if exists
    const previousPatient = patients.find(
      p => p.professionalId === currentProfessional?.id && p.status === 'llamado'
    );

    if (previousPatient) {
      await updatePatient({
        ...previousPatient,
        status: 'en-proceso',
        room: undefined,
      });
    }

    // Update current patient
    await updatePatient({
      ...patient,
      status: 'llamado',
      room: assignedRoom.number,
    });

    // Update room status
    await updateRoom({
      ...assignedRoom,
      status: 'ocupado',
      currentPatientId: patient.id,
    });

    // Close recall modal if open
    setShowRecallModal(false);
  };

  const handleClearWaitingList = async () => {
    if (!currentProfessional) return;
    
    const waitingPatients = patients.filter(
      p => p.professionalId === currentProfessional.id && p.status === 'esperando'
    );

    for (const patient of waitingPatients) {
      await updatePatient({
        ...patient,
        status: 'en-proceso',
      });
    }
  };

  const RecallModal = () => {
    const previousPatients = patients.filter(
      p => p.professionalId === currentProfessional?.id && p.status === 'en-proceso'
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg mx-4">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Llamar Nuevamente</h3>
            <button
              onClick={() => setShowRecallModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="p-4">
            {previousPatients.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No hay pacientes anteriores para llamar
              </p>
            ) : (
              <div className="space-y-3">
                {previousPatients.map(patient => (
                  <div key={patient.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">Turno: {patient.ticketNumber}</p>
                    </div>
                    <button
                      onClick={() => handleCallPatient(patient)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      Llamar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!currentProfessional) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Acceso Profesional</h3>
          </div>
          <form onSubmit={handleLogin} className="p-4 space-y-4">
            <div>
              <label htmlFor="professional" className="block text-sm font-medium text-gray-700">
                Profesional
              </label>
              <select
                id="professional"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccionar Profesional</option>
                {professionals.map(professional => (
                  <option key={professional.id} value={professional.id}>
                    {professional.name} - {professional.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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

  const waitingPatients = patients.filter(
    p => p.professionalId === currentProfessional.id && p.status === 'esperando'
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{currentProfessional.name}</h3>
              <p className="text-sm text-gray-600">
                {currentProfessional.department}
              </p>
              {assignedRoom ? (
                <p className="text-sm text-green-600 mt-1">
                  Consultorio asignado: {assignedRoom.number}
                </p>
              ) : (
                <p className="text-sm text-red-600 mt-1">
                  No tiene consultorio asignado
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRecallModal(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <History className="h-4 w-4 mr-1" />
                Llamar Nuevamente
              </button>
              {waitingPatients.length > 0 && (
                <button
                  onClick={handleClearWaitingList}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Vaciar Lista
                </button>
              )}
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Pacientes en Espera ({waitingPatients.length})
          </h4>
          {waitingPatients.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay pacientes en espera
            </p>
          ) : (
            <div className="space-y-3">
              {waitingPatients.map(patient => (
                <div key={patient.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">Turno: {patient.ticketNumber}</p>
                    {patient.estimatedWaitTime && (
                      <p className="text-sm text-gray-500">
                        Tiempo estimado: {patient.estimatedWaitTime} min
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCallPatient(patient)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Llamar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showRecallModal && <RecallModal />}
    </div>
  );
}