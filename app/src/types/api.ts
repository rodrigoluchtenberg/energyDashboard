export interface EnergyData {
  aparelhoId: number;
  nome: string;
  tipo: string;
  consumoAtual: number;
  dataHora: string;
  tensao: number;
  corrente: number;
  consumoKwh: number;
  correnteCalculada: number;
  corConsumo: string;
}

export interface EnergySummary {
  consumoTotalAtual: number;
  consumoMedioGeral: number;
  totalAparelhos: number;
  aparelhosAtivos: number;
  correnteTotal: number;
  consumoKwhTotal: number;
  percentualDisjuntor: number;
  statusDisjuntor: string;
  corStatus: string;
  topConsumidores: TopConsumidor[];
}

export interface TopConsumidor {
  id: number;
  nome: string;
  tipo: string;
  consumoAtual: number;
  consumoMedio: number;
  ativo: boolean;
  ultimaLeitura: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
}

export type RootStackParamList = {
  Dashboard: undefined;
  Settings: undefined;
  Charts: undefined;
};

export interface AppState {
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}
