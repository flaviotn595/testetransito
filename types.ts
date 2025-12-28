export interface OriginalRow {
  Origem: string;
  Tipo: string;
  Destino: string;
  'Centro de Distribuição'?: string;
  NF: string;
  Série?: string;
  'Data de Emissão': string;
  'Data de Prazo': string;
  'Código do Produto'?: string;
  'Descrição do Produto'?: string;
  Unidade?: string;
  Quantidade?: string;
  'Chave da NF'?: string;
  CFOP?: string;
  Valor: string;
  CGO: string;
  'Descrição do CGO': string;
  Operador: string;
  Objetivo?: string;
  [key: string]: any;
}

export interface TransformedRow {
  id: string;
  DE: string;
  PARA: string;
  BDV: string;
  NF: string;
  'DATA E': string;
  'DATA P': string;
  VALOR: string;
  'CGO-DESC': string;
  OPERADOR: string;
}

export interface ReferenceRow {
  'NUMERO PEDIDO': string;
  'ID. REF. PEDIDO': string;
  'CLIENTE': string;
  'ROMANEIO': string;
  'DATA CRIACAO ROMANEIO': string;
  'STATUS': string;
}

// Interface for grouped report data
export interface ReportGroup {
  nfs: TransformedRow[];
  total: number;
}
