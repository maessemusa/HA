import React from 'react';
import { useStore } from '../../store/useStore';
import { PatientForm } from '../PatientForm';
import { ListPlus, UserX } from 'lucide-react';

export function PatientManagement() {
  const { patients, professionals, updatePatient } = useStore();
  const waitingPatients = patients.filter(p => p.status === 'esperando');

  const handlePatientSubmit = (data: {
    names: string;
    professionalId: string;
  }) => {
    // Split names by newline and filter out empty lines
    const patientNames = data.names
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    // Create a new patient for each name
    patientNames.forEach((name, index) => {
      const newPatient = {
        id: `pat_${Date.now()}_${index}`,
        name,
        ticketNumber: `A${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        department: data.department,
        status: 'esperando',
        professionalId: data.professionalId,
        estimatedWaitTime: Math.floor(Math.random() * 30) + 15,
      };

      updatePatient(newPatient);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <ListPlus className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Registro de Pacientes</h3>
        </div>
        <div className="p-4">
          <PatientForm
            professionals={professionals}
            onSubmit={handlePatientSubmit}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <UserX className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Lista de Espera</h3>
        </div>
        <div className="p-4">
          <div className="divide-y">
            {waitingPatients.map(patient => (
              <div key={patient.id} className="py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-gray-600">Turno: {patient.ticketNumber}</p>
                    <p className="text-sm text-gray-600">{patient.department}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    Espera: {patient.estimatedWaitTime} min
                  </span>
                </div>
              </div>
            ))}
            {waitingPatients.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                No hay pacientes en espera
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}