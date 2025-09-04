using EnergyMonitor.Services.Interfaces;
using EnergyMonitor.Models.DTOs;
using EnergyMonitor.Models.Entities;
using EnergyMonitor.Repositories.Interfaces;
using EnergyMonitor.Models;

namespace EnergyMonitor.Services.Implementations
{
    public class EstatisticasService : IEstatisticasService
    {
        private readonly IAparelhoRepository _aparelhoRepository;
        private readonly ILeituraRepository _leituraRepository;
        private readonly ILogger<EstatisticasService> _logger;
        private readonly Random _random = new Random();
        private IEnumerable<ConsumoRealtimeDto>? _cachedConsumo = null;
        private DateTime _cacheTimestamp = DateTime.MinValue;

        public EstatisticasService(
            IAparelhoRepository aparelhoRepository,
            ILeituraRepository leituraRepository,
            ILogger<EstatisticasService> logger)
        {
            _aparelhoRepository = aparelhoRepository;
            _leituraRepository = leituraRepository;
            _logger = logger;
        }

        public async Task<EstatisticasDto> GetEstatisticasGeraisAsync()
        {
            var aparelhos = await _aparelhoRepository.GetAllAsync();
            var consumoRealtime = await GetConsumoRealtimeSharedAsync();
            var consumoTotal = Math.Round(consumoRealtime.Sum(c => c.ConsumoAtual), 2);
            var correnteTotal = CalcularCorrenteTotalComValidacao(consumoRealtime);
            var percentualDisjuntor = Math.Round((correnteTotal / ConfiguracaoEnergia.Eletrica.CapacidadeMaximaAmperes) * 100, 2);

            var status = percentualDisjuntor switch
            {
                > 90 => "🔴 Crítico",
                > 70 => "🟡 Atenção",
                _ => "🟢 Seguro"
            };

            var corStatus = percentualDisjuntor switch
            {
                > 90 => "danger",
                > 70 => "warning",
                _ => "success"
            };

            return new EstatisticasDto
            {
                ConsumoTotalAtual = consumoTotal,
                ConsumoMedioGeral = consumoRealtime.Any() ? consumoRealtime.Average(c => c.ConsumoAtual) : 0,
                TotalAparelhos = aparelhos.Count(),
                AparelhosAtivos = consumoRealtime.Count(c => c.ConsumoAtual > 0),
                CorrenteTotal = correnteTotal,
                ConsumoKwhTotal = consumoRealtime.Sum(c => c.ConsumoKwh),
                PercentualDisjuntor = percentualDisjuntor,
                StatusDisjuntor = status,
                CorStatus = corStatus,
                TopConsumidores = consumoRealtime
                    .OrderByDescending(c => c.ConsumoAtual)
                    .Take(5)
                    .Select(c => new AparelhoDto
                    {
                        Id = c.AparelhoId,
                        Nome = c.Nome,
                        Tipo = c.Tipo,
                        ConsumoMedio = c.ConsumoAtual,
                        ConsumoAtual = c.ConsumoAtual,
                        Ativo = c.ConsumoAtual > 0,
                        UltimaLeitura = c.DataHora
                    })
                    .ToList()
            };
        }

        public async Task<IEnumerable<ConsumoRealtimeDto>> GetConsumoRealtimeAsync()
        {
            return await GetConsumoRealtimeSharedAsync();
        }

        private async Task<IEnumerable<ConsumoRealtimeDto>> GetConsumoRealtimeSharedAsync()
        {

            var seed = (int)(DateTime.Now.Ticks / 10000000); 
            var cacheKey = $"consumo_realtime_{seed}";
            
            if (_cachedConsumo != null && (DateTime.Now - _cacheTimestamp).TotalSeconds < 10)
            {
                return _cachedConsumo;
            }

            var aparelhos = await _aparelhoRepository.GetAllAsync();
            
            var randomConsistente = new Random(seed);

            var resultado = aparelhos.Select(aparelho =>
            {
                var variacao = (randomConsistente.NextDouble() * 0.4 - 0.2);
                var consumoAtual = Math.Round((double)aparelho.ConsumoMedioWatts * (1 + variacao), 2);
                
                var correnteCalculada = CalcularCorrenteComPrecisao(consumoAtual, ConfiguracaoEnergia.Eletrica.TensaoPadrao);
                var consumoKwh = Math.Round((consumoAtual * ConfiguracaoEnergia.Eletrica.FatorEficiencia) / 1000, 4);

                return new ConsumoRealtimeDto
                {
                    AparelhoId = aparelho.AparelhoId,
                    Nome = aparelho.Nome,
                    Tipo = aparelho.Tipo,
                    ConsumoAtual = consumoAtual,
                    DataHora = DateTime.Now,
                    Tensao = ConfiguracaoEnergia.Eletrica.TensaoPadrao,
                    Corrente = correnteCalculada,
                    CorrenteCalculada = correnteCalculada,
                    ConsumoKwh = consumoKwh,
                    CorConsumo = GetCorConsumo(consumoAtual)
                };
            }).ToList();

            _cachedConsumo = resultado;
            _cacheTimestamp = DateTime.Now;
            return resultado;
        }

        private static string GetCorConsumo(double consumoWatts)
        {
            return consumoWatts switch
            {
                > 1500 => "danger",
                > 800 => "warning",
                > 300 => "success",
                _ => "success"
            };
        }

        private static double CalcularCorrenteComPrecisao(double potenciaWatts, double tensaoVolts)
        {
            if (tensaoVolts <= 0)
            {
                throw new ArgumentException("Tensão deve ser maior que zero", nameof(tensaoVolts));
            }

            var corrente = potenciaWatts / tensaoVolts;
            return Math.Round(corrente, 4);
        }

        public void InvalidateCache()
        {
            _cachedConsumo = null;
            _cacheTimestamp = DateTime.MinValue;
            _logger.LogInformation("Cache interno do EstatisticasService invalidado");
        }

        private static double CalcularCorrenteTotalComValidacao(IEnumerable<ConsumoRealtimeDto> consumos)
        {
            var consumosList = consumos.ToList();
            
            if (!consumosList.Any())
            {
                return 0.0;
            }

            return Math.Round(consumosList.Sum(c => c.CorrenteCalculada), 3);
        }
    }
}
