
import React from 'react';

interface FilterBoxProps {
    title: string;
    items: string[];
    selected: string[];
    setSelected: (items: string[]) => void;
}

export const FilterBox: React.FC<FilterBoxProps> = ({ title, items, selected, setSelected }) => (
    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col h-72 transition-all hover:border-emerald-200">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
            <button onClick={() => setSelected(selected.length === items.length ? [] : [...items])} className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-lg">
                {selected.length === items.length ? 'Limpar' : 'Todos'}
            </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {items.map((item: string) => (
                <label key={item} className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${selected.includes(item) ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50 text-slate-500'}`}>
                    <input type="checkbox" checked={selected.includes(item)} onChange={() => {
                        if (selected.includes(item)) setSelected(selected.filter((i: any) => i !== item));
                        else setSelected([...selected, item]);
                    }} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-[11px] font-bold truncate">{item}</span>
                </label>
            ))}
        </div>
    </div>
);
