import React from 'react';

interface StepNavigationProps {
    activeStep: number;
    setActiveStep: (step: number) => void;
    hasData: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({ activeStep, setActiveStep, hasData }) => {
    return (
        <nav className="flex gap-2 bg-white p-1.5 rounded-2xl w-fit mb-10 shadow-sm border border-slate-100">
            <button onClick={() => setActiveStep(1)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeStep === 1 ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>1. Importar</button>
            <button disabled={!hasData} onClick={() => setActiveStep(2)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeStep === 2 ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>2. Cruzar</button>
            <button disabled={!hasData} onClick={() => setActiveStep(3)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeStep === 3 ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>3. Relatório</button>
        </nav>
    );
};
