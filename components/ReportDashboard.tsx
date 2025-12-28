
import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { TransformedRow, ReportGroup } from '../types';
import { ICONS, OUTPUT_COLUMNS } from '../constants';
import { parseCurrency } from '../utils/formatters';
import { FilterBox } from './FilterBox';

interface ReportDashboardProps {
    data: TransformedRow[];
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({ data }) => {
    const [selectedDe, setSelectedDe] = useState<string[]>([]);
    const [selectedPara, setSelectedPara] = useState<string[]>([]);
    const [selectedOperadores, setSelectedOperadores] = useState<string[]>([]);
    const [selectedCgos, setSelectedCgos] = useState<string[]>([]);

    const uniqueDe = useMemo(() => Array.from(new Set(data.map(d => d.DE))).sort(), [data]);
    const uniquePara = useMemo(() => Array.from(new Set(data.map(d => d.PARA))).sort(), [data]);
    const uniqueOps = useMemo(() => Array.from(new Set(data.map(d => d.OPERADOR))).sort(), [data]);
    const uniqueCgos = useMemo(() => Array.from(new Set(data.map(d => d['CGO-DESC']))).sort(), [data]);

    const filteredData = useMemo(() => {
        return data.filter(d => {
            const matchDe = selectedDe.length === 0 || selectedDe.includes(d.DE);
            const matchPara = selectedPara.length === 0 || selectedPara.includes(d.PARA);
            const matchOp = selectedOperadores.length === 0 || selectedOperadores.includes(d.OPERADOR);
            const matchCgo = selectedCgos.length === 0 || selectedCgos.includes(d['CGO-DESC']);
            return matchDe && matchPara && matchOp && matchCgo;
        });
    }, [data, selectedDe, selectedPara, selectedOperadores, selectedCgos]);

    const reportGroups = useMemo<Record<string, ReportGroup>>(() => {
        const groups: Record<string, ReportGroup> = {};
        filteredData.forEach(row => {
            const bdv = row.BDV;
            if (!groups[bdv]) groups[bdv] = { nfs: [], total: 0 };
            groups[bdv].nfs.push(row);
            groups[bdv].total += parseCurrency(row.VALOR);
        });
        return groups;
    }, [filteredData]);

    const formatBDV = (val: string) => {
        if (val === 'PENDENTE') return <span className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-[10px] font-black border border-red-100">PENDENTE</span>;
        return <span className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-black shadow-sm">{val}</span>;
    };

    const downloadData = (dataToExport: any[], filename: string) => {
        const csv = Papa.unparse(dataToExport.map(row => {
            const obj: any = {};
            OUTPUT_COLUMNS.forEach(col => { obj[col] = (row as any)[col]; });
            return obj;
        }), { delimiter: ';' });
        const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
    };

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute right-[-10%] top-[-10%] text-white/5 transform scale-150 rotate-12">{ICONS.Table}</div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">NF's Processadas</p>
                    <h2 className="text-5xl font-black text-emerald-400 tracking-tighter">{filteredData.length}</h2>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lotes de Entrega</p>
                    <h2 className="text-5xl font-black text-slate-800 tracking-tighter">{Object.keys(reportGroups).length}</h2>
                </div>
                <button onClick={() => downloadData(filteredData, 'logiflow_final')} className="bg-emerald-600 text-white rounded-[2.5rem] font-black uppercase text-xs hover:bg-emerald-700 shadow-xl shadow-emerald-100 flex items-center justify-center gap-4 group transition-all">
                    <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">{ICONS.Download}</div>
                    Baixar Relatório Excel
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-slate-100/50 rounded-[3rem] border-2 border-slate-100">
                <FilterBox title="Origem" items={uniqueDe} selected={selectedDe} setSelected={setSelectedDe} />
                <FilterBox title="Destino" items={uniquePara} selected={selectedPara} setSelected={setSelectedPara} />
                <FilterBox title="Operador" items={uniqueOps} selected={selectedOperadores} setSelected={setSelectedOperadores} />
                <FilterBox title="CGO" items={uniqueCgos} selected={selectedCgos} setSelected={setSelectedCgos} />
            </div>

            <div className="space-y-10 pb-24">
                {Object.entries(reportGroups).map(([bdv, data]) => (
                    <div key={bdv} className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all">
                        <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex justify-between items-center border-l-8 border-emerald-500">
                            <div className="flex items-center gap-6">
                                <div className="transform scale-125">{formatBDV(bdv)}</div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Romaneio</p>
                                    <p className="text-xl font-black text-slate-900 uppercase">Lista de Documentos</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-emerald-600 leading-none">{data.nfs.length} <span className="text-xs font-bold text-slate-400">ITENS</span></p>
                            </div>
                        </div>
                        <div className="p-8">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-300 uppercase italic">Documento (NF)</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-300 uppercase italic">Operador Responsável</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-300 uppercase italic">Localização Destino</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {data.nfs.map(nf => (
                                        <tr key={nf.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5 text-sm font-black text-slate-800">{nf.NF}</td>
                                            <td className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{nf.OPERADOR}</td>
                                            <td className="px-6 py-5 text-[11px] font-black text-emerald-700 uppercase italic">{nf.PARA}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
