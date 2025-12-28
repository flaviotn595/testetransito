/* eslint-disable no-restricted-globals */
import Papa from 'papaparse';
import { radicalNormalize, cleanNF, checkValue } from '../utils/formatters';
import { TransformedRow } from '../types';

// Definir os tipos do Worker
interface WorkerMessage {
    type: 'PROCESS_DATA' | 'PROCESS_REF';
    payload: any;
}

// Escutar mensagens do thread principal
self.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
    const { type, payload } = e.data;

    try {
        if (type === 'PROCESS_DATA') {
            processOriginalData(payload);
        }
        // Futura implementação para PROCESS_REF se necessário
    } catch (err: any) {
        self.postMessage({ type: 'ERROR', error: err.message });
    }
});

const processOriginalData = (rawInput: string) => {
    if (!rawInput.trim()) return;

    const parsed = Papa.parse(rawInput, {
        header: false,
        skipEmptyLines: 'greedy',
        delimiter: "", // Auto-detect
    });

    const rows = parsed.data as string[][];
    if (rows.length === 0) {
        self.postMessage({ type: 'ERROR', error: "Nenhum dado encontrado." });
        return;
    }

    // 1. Identificar cabeçalho e colunas
    const firstLine = rows[0].map(c => radicalNormalize(c));
    const hasHeader = firstLine.some(p => ['DE', 'ORIGEM', 'PARA', 'DESTINO', 'NF', 'CGO', 'VALOR'].includes(p));

    let colIdx = {
        de: 0, para: 1, bdv: 2, nf: 3, dataE: 4, dataP: 5, valor: 6, cgo: 7, op: 8
    };

    if (hasHeader) {
        firstLine.forEach((h, i) => {
            if (h.includes('ORIGEM') || h === 'DE') colIdx.de = i;
            if (h.includes('DESTINO') || h === 'PARA') colIdx.para = i;
            if (h.includes('ROMANEIO') || h === 'BDV' || h === 'LOTE') colIdx.bdv = i;
            if (h.includes('NF') || h.includes('NOTA') || h.includes('NUMERO')) colIdx.nf = i;
            if (h.includes('EMISSAO') || (h.includes('DATA') && !h.includes('PRAZO'))) colIdx.dataE = i;
            if (h.includes('PRAZO')) colIdx.dataP = i;
            if (h.includes('VALOR')) colIdx.valor = i;
            if (h.includes('CGO')) colIdx.cgo = i;
            if (h.includes('OPERADOR')) colIdx.op = i;
        });
    }

    const dataRows = hasHeader ? rows.slice(1) : rows;

    const results: TransformedRow[] = dataRows.map((parts, index) => {
        const cleanParts = parts.map(p => (p || '').trim());

        let de = cleanParts[colIdx.de];
        let para = cleanParts[colIdx.para];
        let maybeBDV = cleanParts[colIdx.bdv];
        let maybeNF = cleanParts[colIdx.nf];

        // Lógica de swap NF/BDV
        const looksLikeNF = (val: string) => /^\d{6,9}$/.test(val);

        let finalBDV = maybeBDV;
        let finalNF = maybeNF;

        if (looksLikeNF(maybeBDV) && (!maybeNF || maybeNF === '')) {
            finalBDV = 'PENDENTE';
            finalNF = maybeBDV;
        }

        if (!de || de.toUpperCase() === 'UNDEFINED') de = cleanParts[0] || 'PENDENTE';

        return {
            id: `row-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            DE: checkValue(de),
            PARA: checkValue(para),
            BDV: checkValue(finalBDV),
            NF: checkValue(finalNF),
            'DATA E': checkValue(cleanParts[colIdx.dataE]),
            'DATA P': checkValue(cleanParts[colIdx.dataP]),
            VALOR: checkValue(cleanParts[colIdx.valor], '0,00'),
            'CGO-DESC': checkValue(cleanParts[colIdx.cgo]),
            OPERADOR: checkValue(cleanParts[colIdx.op] || cleanParts[colIdx.op - 1]),
        };
    });

    if (results.length === 0) {
        self.postMessage({ type: 'ERROR', error: "Nenhum dado processado." });
        return;
    }

    self.postMessage({ type: 'SUCCESS', data: results });
};
