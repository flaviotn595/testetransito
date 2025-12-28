import React, { useState, useMemo } from 'react';
import { TransformedRow } from '../types';
import { OUTPUT_COLUMNS, ICONS } from '../constants';

interface ProcessingTableProps {
    data: TransformedRow[];
    onNext: () => void;
    onRefLink: () => void;
}

const PAGE_SIZE = 50;

export const ProcessingTable: React.FC<ProcessingTableProps> = ({ data, onNext, onRefLink }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return data.slice(start, start + PAGE_SIZE);
    }, [data, currentPage]);

    const formatBDV = (val: string) => {
        if (val === 'PENDENTE') return <span className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-[10px] font-black border border-red-100">PENDENTE</span>;
        return <span className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-black shadow-sm">{val}</span>;
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl flex flex-col lg:flex-row gap-6 items-center justify-between border border-slate-100">
                <div className="flex items-center gap-6">
                    <div className="bg-emerald-100 text-emerald-600 p-5 rounded-2xl shadow-inner">{ICONS.Check}</div>
                    <div>
                        <div className="text-2xl font-black text-slate-900 tracking-tight">{data.length} Documentos Identificados</div>
                        <div className="text-[10px] font-black text-emerald-600 uppercase mt-1 italic tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            Mapeamento Concluído
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={onRefLink} className="px-6 py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-slate-700 shadow-md transition-all active:scale-95">Vincular Romaneios</button>
                    <button onClick={onNext} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-700 shadow-xl shadow-emerald-100 transform hover:scale-105 transition-all">Visualizar Relatório</button>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
                <div className="overflow-x-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="sticky top-0 z-20 bg-white border-b shadow-sm">
                            <tr>{OUTPUT_COLUMNS.map(col => <th key={col} className="px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-widest">{col}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentData.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-4 text-xs font-bold text-slate-900 uppercase">{row.DE}</td>
                                    <td className="px-8 py-4 text-xs font-bold text-slate-700 uppercase">{row.PARA}</td>
                                    <td className="px-8 py-4">{formatBDV(row.BDV)}</td>
                                    <td className="px-8 py-4 text-xs font-black text-emerald-700 italic">{row.NF}</td>
                                    <td className="px-8 py-4 text-[10px] text-slate-400 font-bold">{row['DATA E']}</td>
                                    <td className="px-8 py-4 text-[10px] text-slate-400 font-bold">{row['DATA P']}</td>
                                    <td className="px-8 py-4 text-xs font-black text-slate-800">{row.VALOR}</td>
                                    <td className="px-8 py-4 text-[9px] text-slate-400 font-bold italic max-w-[200px] truncate">{row['CGO-DESC']}</td>
                                    <td className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">{row.OPERADOR}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginação */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                        className="px-4 py-2 rounded-xl bg-white text-slate-500 font-bold text-xs shadow-sm disabled:opacity-50 hover:bg-slate-100"
                    >
                        Anterior
                    </button>
                    <span className="text-xs font-black text-slate-400">Página {currentPage} de {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                        className="px-4 py-2 rounded-xl bg-white text-emerald-600 font-bold text-xs shadow-sm disabled:opacity-50 hover:bg-emerald-50"
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
};
