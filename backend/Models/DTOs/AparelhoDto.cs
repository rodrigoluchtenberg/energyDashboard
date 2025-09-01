using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EnergyMonitor.Models.DTOs
{
    public class AparelhoDto
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Tipo é obrigatório")]
        [StringLength(50, ErrorMessage = "Tipo deve ter no máximo 50 caracteres")]
        public string Tipo { get; set; } = string.Empty;
        
        [Range(0, double.MaxValue, ErrorMessage = "Consumo atual deve ser maior que zero")]
        public double ConsumoAtual { get; set; }
        
        [Range(0, double.MaxValue, ErrorMessage = "Consumo médio deve ser maior que zero")]
        public double ConsumoMedio { get; set; }
        
        public bool Ativo { get; set; }
        public DateTime UltimaLeitura { get; set; }
    }
    
    public class ConsumoRealtimeDto
    {
        public int AparelhoId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public double ConsumoAtual { get; set; }
        public DateTime DataHora { get; set; }
        public double? Tensao { get; set; }
        public double? Corrente { get; set; }
        public double ConsumoKwh { get; set; }
        public double CorrenteCalculada { get; set; }
        public string CorConsumo { get; set; } = string.Empty;
    }
    
    public class EstatisticasDto
    {
        public double ConsumoTotalAtual { get; set; }
        public double ConsumoMedioGeral { get; set; }
        public int TotalAparelhos { get; set; }
        public int AparelhosAtivos { get; set; }
        public double CorrenteTotal { get; set; }
        public double ConsumoKwhTotal { get; set; }
        public double PercentualDisjuntor { get; set; } 
        public string StatusDisjuntor { get; set; } = string.Empty;
        public string CorStatus { get; set; } = string.Empty;
        public List<AparelhoDto> TopConsumidores { get; set; } = new();
    }

    public class CreateAparelhoDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        [JsonPropertyName("nome")]
        public string Nome { get; set; } = string.Empty;
        
        [Range(0.1, 10000, ErrorMessage = "Consumo médio deve estar entre 0.1W e 10000W")]
        [JsonPropertyName("consumoMedio")]
        public double ConsumoMedio { get; set; }
    }

    public class UpdateAparelhoDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;
        
        [Range(0.1, 10000, ErrorMessage = "Consumo médio deve estar entre 0.1W e 10000W")]
        public double ConsumoMedio { get; set; }
    }
}
