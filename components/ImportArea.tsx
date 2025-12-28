import React, { useRef, useState } from 'react';
import { ICONS } from '../constants';

interface ImportAreaProps {
    onProcess: (data: string) => void;
}

export const ImportArea: React.FC<ImportAreaProps> = ({ onProcess }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pasteValue, setPasteValue] = useState('');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
            <div className="lg:col-span-2">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-[30rem] border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center bg-white border-slate-100 group shadow-sm p-12 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/20 transition-all"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv,.txt,.xlsx,.xls"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => onProcess(ev.target?.result as string);
                                reader.readAsText(file);
                            }
                        }}
                    />
                    <div className="mb-8 p-12 rounded-full bg-slate-50 text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:scale-105 shadow-inner">{ICONS.File}</div>
                    <h3 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">Importar Base Principal</h3>
                    <p className="text-slate-400 text-[11px] font-bold mt-3 uppercase tracking-[0.2em] italic">Clique para selecionar o arquivo Excel/CSV original</p>
                    <div className="mt-8 flex gap-3">
                        <span className="px-4 py-2 bg-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-all">Suporte a CSV</span>
                        <span className="px-4 py-2 bg-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-all">Excel Tab</span>
                    </div>
                </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-slate-900 text-white p-2 rounded-lg">{ICONS.Sync}</div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Área de Colagem Direta</h3>
                </div>
                <textarea
                    className="flex-1 w-full p-6 border-2 border-slate-50 rounded-2xl bg-slate-50 outline-none font-mono text-[10px] focus:bg-white focus:border-emerald-500 transition-all mb-6 shadow-inner resize-none"
                    placeholder="Copie do Excel e cole aqui..."
                    value={pasteValue}
                    onChange={(e) => setPasteValue(e.target.value)}
                />
                <button
                    onClick={() => onProcess(pasteValue)}
                    disabled={!pasteValue.trim()}
                    className="w-full bg-slate-800 text-white py-6 rounded-2xl font-black text-xs hover:bg-emerald-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                >
                    Sincronizar Dados Colados
                </button>
            </div>
        </div>
    );
};
