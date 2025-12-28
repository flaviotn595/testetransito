import React, { useState, useEffect } from 'react';
import { useLogisticsData } from './hooks/useLogisticsData';
import { Header } from './components/Header';
import { StepNavigation } from './components/StepNavigation';
import { ImportArea } from './components/ImportArea';
import { ProcessingTable } from './components/ProcessingTable';
import { ReportDashboard } from './components/ReportDashboard';
import { RefModal } from './components/RefModal';

const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showRefModal, setShowRefModal] = useState(false);

  const {
    data,
    loading,
    error,
    isSyncing,
    processData,
    fetchFromSupabase,
    clearData,
    setData
  } = useLogisticsData();

  // Carregar dados do Supabase ao iniciar
  useEffect(() => {
    fetchFromSupabase().then(() => {
      // Se tiver dados, ir para step 2
    });
  }, [fetchFromSupabase]);

  // Avançar step automaticamente quando houver dados
  useEffect(() => {
    if (data.length > 0 && activeStep === 1) {
      setActiveStep(2);
    }
  }, [data, activeStep]);

  const handleProcess = (rawInput: string) => {
    if (rawInput.trim()) {
      processData(rawInput);
    }
  };

  const handleReset = async () => {
    await clearData();
    setActiveStep(1);
  };

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50/50">
      <Header
        activeStep={activeStep}
        isSyncing={isSyncing}
        onReset={handleReset}
      />

      <main className="max-w-7xl mx-auto">
        <StepNavigation
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          hasData={data.length > 0}
        />

        {error && (
          <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 font-bold text-xs rounded-r-2xl shadow-sm">
            {error}
          </div>
        )}

        {activeStep === 1 && (
          <ImportArea onProcess={handleProcess} />
        )}

        {activeStep === 2 && (
          <ProcessingTable
            data={data}
            onNext={() => setActiveStep(3)}
            onRefLink={() => setShowRefModal(true)}
          />
        )}

        {activeStep === 3 && (
          <ReportDashboard data={data} />
        )}

        {showRefModal && (
          <RefModal
            data={data}
            onUpdateData={setData}
            onClose={() => setShowRefModal(false)}
          />
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
