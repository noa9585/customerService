using Repository.Entities;
using Repository.interfaces;
using Service1.Logic;
using Service1.Interface; // וודאי שה-Namespace הזה נכון עבור הממשק של ה-Service

namespace WebApplication1.BackgroundServices
{
    public class QueueUpdateWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IChatQueueManager _queueManager;

        public QueueUpdateWorker(IServiceProvider serviceProvider, IChatQueueManager queueManager)
        {
            _serviceProvider = serviceProvider;
            _queueManager = queueManager;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var sessionRepo = scope.ServiceProvider.GetRequiredService<IChatSessionRepository>();
                    var chatSessionService = scope.ServiceProvider.GetRequiredService<IChatSessionService>();
                    var topicRepo = scope.ServiceProvider.GetRequiredService<IRepository<Topic>>();

                    var waitingIds = _queueManager.GetAllWaitingIds();

                    foreach (var id in waitingIds)
                    {
                        var s = sessionRepo.GetById(id);
                        if (s == null) continue;

                        var topic = topicRepo.GetById(s.IDTopic);

                        // 1. עדכון הציון בזיכרון (מהיר מאוד)
                        double score = (DateTime.Now - s.StartTimestamp).TotalSeconds * (topic?.priorityTopics ?? 1.0);
                        _queueManager.UpdateScore(id, score);

                        // 2. חישוב זמן המתנה מעודכן ועדכון האובייקט בזיכרון ה-EF
                        s.EstimatedWaitTime = chatSessionService.CalculateWaitTime(topic.IDTopic);

                        // כאן אנחנו קוראים לעדכון, אבל זה מבצע שמירה ל-DB בכל סיבוב
                        sessionRepo.UpdateItem(id, s);
                    }
                    // הערה: אם תרצי לייעל עוד יותר, נצטרך להוסיף פונקציה ל-Repository 
                    // שמעדכנת בלי לשמור, ולקרוא ל-context.save() רק פעם אחת כאן בסוף הלולאה.
                }
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }
    }
}