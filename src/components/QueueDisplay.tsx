import React, { useEffect, useRef, useState } from 'react';
import { Patient } from '../types';
import { Users, Volume2, Youtube } from 'lucide-react';
import { useStore } from '../store/useStore';
import { playNotificationSound } from '../utils/sound';
import { initializeSocket } from '../services/socket';

interface QueueDisplayProps {
  currentPatients: Patient[];
  lastCalled: Patient[];
}

export function QueueDisplay({ currentPatients, lastCalled }: QueueDisplayProps) {
  const { professionals, setPatients } = useStore();
  const prevLastCalledRef = useRef<Patient[]>([]);
  const [blinkingPatients, setBlinkingPatients] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize WebSocket connection and handle updates
    const cleanup = initializeSocket((updatedPatients) => {
      setPatients(updatedPatients);
    });

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    // Check if there are new called patients by comparing with previous state
    const newCalled = lastCalled.filter(
      current => !prevLastCalledRef.current.some(prev => prev.id === current.id)
    );

    if (newCalled.length > 0) {
      // Play notification sound
      playNotificationSound();

      // Add new patients to blinking set
      const newBlinkingPatients = new Set(blinkingPatients);
      newCalled.forEach(patient => {
        newBlinkingPatients.add(patient.id);
      });
      setBlinkingPatients(newBlinkingPatients);

      // Remove blinking effect after 5 seconds for these patients
      setTimeout(() => {
        setBlinkingPatients(prev => {
          const updated = new Set(prev);
          newCalled.forEach(patient => {
            updated.delete(patient.id);
          });
          return updated;
        });
      }, 5000);
    }

    // Update reference to current lastCalled state
    prevLastCalledRef.current = lastCalled;
  }, [lastCalled]);

  const getPatientInfo = (patient: Patient) => {
    const professional = professionals.find(p => p.id === patient.professionalId);
    return {
      name: patient.name,
      ticketNumber: patient.ticketNumber,
      professional: professional?.name || '',
      room: patient.room || '',
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto p-6">
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Volume2 className="h-6 w-6" />
              Llamando Ahora
            </h2>
          </div>
          <div className="p-4 divide-y">
            {lastCalled.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No hay pacientes siendo llamados</p>
            ) : (
              lastCalled.map((patient) => {
                const info = getPatientInfo(patient);
                return (
                  <div
                    key={patient.id}
                    className={`flex items-center justify-between p-4 ${
                      blinkingPatients.has(patient.id) ? 'blink-attention' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {info.ticketNumber}
                      </span>
                      <div>
                        <p className="font-semibold">{info.name}</p>
                        <p className="text-sm text-gray-600">{info.professional}</p>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      Consultorio {info.room}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-800 p-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Youtube className="h-6 w-6" />
              Contenido Informativo
            </h2>
          </div>
          <div className="aspect-video bg-gray-100 p-4">
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-600 text-center">
                La reproducción de videos no está disponible en este momento.
                <br />
                Por favor, consulte con el personal del hospital para más información.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-800 p-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6" />
            Lista de Espera
          </h2>
        </div>
        <div className="p-4 divide-y">
          {currentPatients.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay pacientes en espera</p>
          ) : (
            currentPatients.map((patient) => {
              const info = getPatientInfo(patient);
              return (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-700">
                      {info.ticketNumber}
                    </span>
                    <div>
                      <p className="font-semibold">{info.name}</p>
                      <p className="text-sm text-gray-600">{info.professional}</p>
                    </div>
                  </div>
                  {patient.estimatedWaitTime && (
                    <div className="text-sm text-gray-600">
                      Espera est.: {patient.estimatedWaitTime} min
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}