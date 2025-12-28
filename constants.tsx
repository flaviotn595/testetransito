
import React from 'react';
import { FileText, Table, RefreshCw, Download, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#22c55e',
  danger: '#ef4444',
};

export const ICONS = {
  File: <FileText className="w-5 h-5" />,
  Table: <Table className="w-5 h-5" />,
  Sync: <RefreshCw className="w-5 h-5" />,
  Download: <Download className="w-5 h-5" />,
  Check: <CheckCircle2 className="w-5 h-5" />,
  Error: <AlertCircle className="w-5 h-5" />,
  Delete: <Trash2 className="w-4 h-4" />,
};

export const OUTPUT_COLUMNS = [
  'DE',
  'PARA',
  'BDV',
  'NF',
  'DATA E',
  'DATA P',
  'VALOR',
  'CGO-DESC',
  'OPERADOR',
];
