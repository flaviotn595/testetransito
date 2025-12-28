
export const radicalNormalize = (str: string) =>
    str ? str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .trim()
        .toUpperCase() : "";

export const cleanNF = (val: any) => {
    const str = String(val || '').trim();
    return str.replace(/\D/g, '').replace(/^0+/, '');
};

export const checkValue = (val: any, fallback: string = 'PENDENTE') => {
    const s = String(val || '').trim();
    if (s === '' || s.toUpperCase() === 'UNDEFINED' || s.toUpperCase() === 'NULL' || s.toUpperCase() === 'NAN') return fallback;
    return s;
};

export const parseCurrency = (val: string) => {
    if (!val || val === 'PENDENTE') return 0;
    const clean = val.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
    return parseFloat(clean) || 0;
};
