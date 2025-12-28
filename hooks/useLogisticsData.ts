import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { TransformedRow } from '../types';

export const useLogisticsData = () => {
    const [data, setData] = useState<TransformedRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/dataProcessor.worker.ts', import.meta.url), {
            type: 'module'
        });

        workerRef.current.onmessage = (e) => {
            const { type, data: resultData, error: errorMsg } = e.data;
            if (type === 'SUCCESS') {
                setData(resultData);
                syncToSupabase(resultData);
                setLoading(false);
            } else if (type === 'ERROR') {
                setError(errorMsg);
                setLoading(false);
            }
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const processData = useCallback((rawInput: string) => {
        setLoading(true);
        setError(null);
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'PROCESS_DATA', payload: rawInput });
        }
    }, []);

    const fetchFromSupabase = useCallback(async () => {
        setLoading(true);
        try {
            const { data: serverData, error: err } = await supabase
                .from('logistics_rows')
                .select('*')
                .order('created_at', { ascending: true });

            if (err) throw err;

            if (serverData && serverData.length > 0) {
                const mapped: TransformedRow[] = serverData.map(item => ({
                    id: item.id,
                    DE: item.de,
                    PARA: item.para,
                    BDV: item.bdv,
                    NF: item.nf,
                    'DATA E': item.data_e,
                    'DATA P': item.data_p,
                    VALOR: item.valor,
                    'CGO-DESC': item.cgo_desc,
                    OPERADOR: item.operador
                }));
                setData(mapped);
            }
        } catch (err: any) {
            console.error(err);
            setError('Erro ao buscar dados do servidor.');
        } finally {
            setLoading(false);
        }
    }, []);

    const syncToSupabase = async (newData: TransformedRow[]) => {
        setIsSyncing(true);
        try {
            const rowsToUpsert = newData.map(row => ({
                id: row.id, de: row.DE, para: row.PARA, bdv: row.BDV, nf: row.NF,
                data_e: row['DATA E'], data_p: row['DATA P'], valor: row.VALOR,
                cgo_desc: row['CGO-DESC'], operador: row.OPERADOR
            }));
            // Chunk inserts if too large? For now, direct upsert
            const { error } = await supabase.from('logistics_rows').upsert(rowsToUpsert, { onConflict: 'id' });
            if (error) throw error;
        } catch (err: any) {
            setError('Erro ao sincronizar com nuvem: ' + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const clearData = useCallback(async () => {
        if (window.confirm('Confirma limpeza total?')) {
            setLoading(true);
            try {
                await supabase.from('logistics_rows').delete().neq('id', 'void');
                setData([]);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    }, []);

    return {
        data,
        loading,
        error,
        isSyncing,
        processData,
        fetchFromSupabase,
        clearData,
        setData // Expose for specific updates (like ref match)
    };
};
