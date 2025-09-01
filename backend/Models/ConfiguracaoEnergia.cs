namespace EnergyMonitor.Models
{
    public static class ConfiguracaoEnergia
    {
        public static class Disjuntor
        {
            public const double LimiteAmperes = 60.0;
            public const double PercentualAtencao = 80.0;
            public const double PercentualCritico = 95.0;
        }

        public static class CoresConsumo
        {
            public const double LimiteAltoConsumo = 1000.0;
            public const double LimiteMedioConsumo = 500.0;
        }

        public static class Eletrica
        {
            public const double TensaoPadrao = 220.0;
            public const double FatorEficiencia = 0.75;
            public const double CapacidadeMaximaAmperes = 60.0;
        }

        public static class Simulacao
        {
            public const int IntervaloAtualizacaoSegundos = 3;
            public const double VariacaoPercentual = 0.2;
        }
    }
}
