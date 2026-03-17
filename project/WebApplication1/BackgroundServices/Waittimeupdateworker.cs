using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Service1.Interface;
using WebApplication1.Hubs;

namespace WebApplication1.BackgroundServices
{
    public class WaitTimeUpdateWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<WaitTimeUpdateWorker> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromSeconds(60);

        public WaitTimeUpdateWorker(IServiceScopeFactory scopeFactory, ILogger<WaitTimeUpdateWorker> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("WaitTimeUpdateWorker started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(_interval, stoppingToken);

                try
                {
                    // IServiceScopeFactory נדרש כי IChatSessionService ו-IHubContext הם Scoped
                    // ו-BackgroundService הוא Singleton
                    using var scope = _scopeFactory.CreateScope();
                    var chatSessionService = scope.ServiceProvider.GetRequiredService<IChatSessionService>();
                    var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<ChatHub>>();

                    await chatSessionService.RecalculateAllWaitingTimes();
                    var sessions = await chatSessionService.GetAllWaiting();
                    await hubContext.Clients.All.SendAsync("WaitingTimesUpdated", sessions, stoppingToken);

                    _logger.LogInformation("Wait times recalculated at {Time}", DateTime.Now);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during wait time recalculation.");
                }
            }
        }
    }
}