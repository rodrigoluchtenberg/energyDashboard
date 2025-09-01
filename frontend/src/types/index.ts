export interface Aparelho {
  id: number;
  nome: string;
  tipo: string;
  consumoAtual: number;
  consumoMedio: number;
  ativo: boolean;
  ultimaLeitura: Date;
}

export interface ConsumoRealtime {
  aparelhoId: number;
  nome: string;
  tipo: string;
  consumoAtual: number;
  dataHora: Date;
  tensao?: number;
  corrente?: number;
  consumoKwh: number;
  correnteCalculada: number;
  corConsumo?: string;
}

export interface Estatisticas {
  consumoTotalAtual: number;
  consumoMedioGeral: number;
  totalAparelhos: number;
  aparelhosAtivos: number;
  correnteTotal: number;
  consumoKwhTotal: number;
  percentualDisjuntor: number;
  statusDisjuntor: string;
  corStatus: string;
  topConsumidores: Aparelho[];
}

export interface ChartData {
  time: string;
  [key: string]: string | number;
}

export interface CreateAparelho {
  nome: string;
  consumoMedio: number;
}