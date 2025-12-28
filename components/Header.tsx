import React from 'react';
import { ICONS } from '../constants';

interface HeaderProps {
    activeStep: number;
    isSyncing: boolean;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeStep, isSyncing, onReset }) => {
    return (
        <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center border-b border-slate-200 pb-8">
            <div className="flex items-center gap-4">
                <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-xl">{ICONS.Table}</div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Logi<span className="text-emerald-600">Flow</span> Cloud</h1>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sincronização Profissional de Movimentação</p>
                </div>
            </div>
            {activeStep > 1 && (
                <div className="flex gap-4">
                    {isSyncing && <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div> Sincronizado</span>}
                    <button onClick={onReset} title="Limpar Tudo" className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">{ICONS.Delete}</button>
                </div>
            )}
        </header>
    );
};
