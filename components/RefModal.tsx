
import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { radicalNormalize, cleanNF } from '../utils/formatters';
import { TransformedRow } from '../types';
import { ICONS } from '../constants';

interface RefModalProps {
    data: TransformedRow[];
    onUpdateData: (newData: TransformedRow[]) => void;
    onClose: () => void;
}

export const RefModal: React.FC<RefModalProps> = ({ data, onUpdateData, onClose }) => {
    const refFileInputRef = useRef<HTMLInputElement>(null);
    const [pasteRefText, setPasteRefText] = useState('');

    const processRefDataRows = (rows: any[]) => {
        if (!rows || rows.length === 0) return;
        const index: any = {};
        const keys = Object.keys(rows[0]);

        const colNF = keys.find(k => {
            const n = radicalNormalize(k);
            return n.includes('NF') || n.includes('PEDIDO') || n.includes('NUMERO');
        }) || keys[0];

        const colBDV = keys.find(k => {
            const n = radicalNormalize(k);
            return n.includes('ROMANEIO') || n.includes('BDV') || n.includes('LOTE');
        }) || keys[1];

        rows.forEach(item => {
            const nf = cleanNF(item[colNF]);
            const bdv = String(item[colBDV] || '').trim();
            if (nf && bdv) index[nf] = bdv;
        });

        const newData = data.map(d => ({
            ...d,
            BDV: index[cleanNF(d.NF)] || d.BDV
        }));

        onUpdateData(newData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in">
            <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-800 italic">Vincular Romaneios</h3>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-300 hover:text-red-500 hover:shadow-lg transition-all text-2xl font-light">×</button>
                </div>
                <div className="p-10 space-y-6">
                    <div
                        onClick={() => refFileInputRef.current?.click()}
                        className="border-4 border-dashed border-slate-100 p-10 rounded-[2.5rem] flex flex-col items-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all text-center group"
                    >
                        <input
                            type="file"
                            ref={refFileInputRef}
                            className="hidden"
                            accept=".csv,.txt"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    Papa.parse(file, {
                                        header: true,
                                        skipEmptyLines: 'greedy',
                                        complete: (r) => processRefDataRows(r.data)
                                    });
                                }
                            }}
                        />
                        <div className="mb-4 text-slate-200 group-hover:text-emerald-600 transition-all transform group-hover:rotate-12">{ICONS.File}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-800">Carregar Arquivo de Romaneio</span>
                    </div>
                    <div className="relative flex items-center justify-center py-2">
                        <div className="absolute w-full border-b border-slate-100"></div>
                        <span className="relative bg-white px-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">Ou colar do excel</span>
                    </div>
                    <textarea
                        className="w-full h-44 p-6 border-2 border-slate-50 rounded-[2rem] bg-slate-50 outline-none font-mono text-[9px] focus:bg-white focus:border-emerald-500 transition-all shadow-inner resize-none"
                        placeholder="NF em uma coluna, Romaneio na outra..."
                        value={pasteRefText}
                        onChange={(e) => setPasteRefText(e.target.value)}
                    />
                    <button onClick={() => {
                        if (!pasteRefText.trim()) return;
                        const parsed = Papa.parse(pasteRefText, { header: true, skipEmptyLines: true }).data;
                        processRefDataRows(parsed);
                    }} className="w-full py-6 bg-slate-900 text-white font-black uppercase text-xs rounded-2xl hover:bg-emerald-600 shadow-xl tracking-widest transition-all active:scale-95">Vincular Dados</button>
                </div>
            </div>
        </div>
    );
};
