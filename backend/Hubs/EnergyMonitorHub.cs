using Microsoft.AspNetCore.SignalR;

namespace EnergyMonitor.Hubs
{
    public class EnergyMonitorHub : Hub
    {
        public async Task SendConsumptionUpdate(object consumptionData)
        {
            await Clients.All.SendAsync("ReceiveConsumptionUpdate", consumptionData);
        }
    }
}
