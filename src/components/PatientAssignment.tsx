import React from 'react';
import { useStore } from '../store/useStore';
import { PatientForm } from './PatientForm';
import { UserPlus } from 'lucide-react';

export function PatientAssignment() {
  const { professionals, updatePatient } = useStore();

  const handlePatientSubmit = (data: {
    name: string;
    department: string;
    professionalId: string;
  }) => {
    const newPatient = {
      id: `pat_${Date.now()}`,
      name: data.name,
      ticketNumber: `A${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      department: data.department,
      status: 'esperando',
      professionalId: data.professionalId,
      estimatedWaitTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutos
    };

    updatePatient(newPatient);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Registro de Pacientes</h3>
      </div>
      <div className="p-4">
        <PatientForm
          professionals={professionals}
          onSubmit={handlePatientSubmit}
        />
      </div>
    </div>
  );
}