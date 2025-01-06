import React from 'react';
import { useForm } from 'react-hook-form';
import { Professional } from '../types';
import { UserPlus } from 'lucide-react';

interface PatientFormData {
  names: string;
  professionalId: string;
}

interface PatientFormProps {
  professionals: Professional[];
  onSubmit: (data: PatientFormData) => void;
}

export function PatientForm({ professionals, onSubmit }: PatientFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PatientFormData>();

  const handleFormSubmit = (data: PatientFormData) => {
    const professional = professionals.find(p => p.id === data.professionalId);
    onSubmit({
      ...data,
      department: professional?.department || '',
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="names" className="block text-sm font-medium text-gray-700">
          Nombres de Pacientes
        </label>
        <textarea
          {...register('names', { 
            required: 'Los nombres son requeridos',
            validate: value => 
              value.trim().split('\n').every(name => name.trim().length > 0) || 
              'Cada línea debe contener un nombre válido'
          })}
          id="names"
          rows={5}
          placeholder="Ingrese un nombre por línea"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Ingrese un nombre de paciente por línea para registrar múltiples pacientes
        </p>
        {errors.names && (
          <p className="mt-1 text-sm text-red-600">{errors.names.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="professionalId" className="block text-sm font-medium text-gray-700">
          Profesional
        </label>
        <select
          {...register('professionalId', { required: 'Debe seleccionar un profesional' })}
          id="professionalId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccionar Profesional</option>
          {professionals.map(professional => (
            <option key={professional.id} value={professional.id}>
              {professional.name} - {professional.department}
            </option>
          ))}
        </select>
        {errors.professionalId && (
          <p className="mt-1 text-sm text-red-600">{errors.professionalId.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        Registrar Pacientes
      </button>
    </form>
  );
}