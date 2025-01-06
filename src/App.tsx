import React, { useEffect } from 'react';
import { QueueDisplay } from './components/QueueDisplay';
import { AdminPanel } from './components/AdminPanel';
import { useStore } from './store/useStore';
import { LayoutDashboard, Users } from 'lucide-react';
import { initializeSound } from './utils/sound';

function App() {
  const [showAdmin, setShowAdmin] = React.useState(false);
  const { initialize, patients } = useStore();

  useEffect(() => {
    // Initialize database and load data
    initialize();
    
    // Initialize notification sound
    initializeSound('/notification.mp3');
  }, []);

  const waitingPatients = patients.filter(
    (patient) => patient.status === 'esperando'
  );
  const calledPatients = patients.filter(
    (patient) => patient.status === 'llamado'
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Estado de la Cola del Hospital
            </h1>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              title={showAdmin ? "Ver Cola" : "Panel de Administración"}
            >
              {showAdmin ? (
                <Users className="h-6 w-6" />
              ) : (
                <LayoutDashboard className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="py-8">
        {showAdmin ? (
          <AdminPanel />
        ) : (
          <QueueDisplay
            currentPatients={waitingPatients}
            lastCalled={calledPatients}
          />
        )}
      </main>

      <footer className="fixed bottom-0 w-full bg-gray-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm">
              Para asistencia de emergencia, contacte al personal del hospital
            </p>
            <p className="text-sm">Emergencias: 911</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;