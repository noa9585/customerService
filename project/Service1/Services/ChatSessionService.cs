using Repository.Entities;
using Repository.interfaces;
using Service1.Dto.ChatSessionDto;
using Service1.Interface;
using Service1.Logic;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Service1.Services
{
    public class ChatSessionService : IChatSessionService
    {
        private readonly IChatSessionRepository _repository;
        private readonly IRepository<Topic> _topicRepository;
        private readonly IRepository<Customer> _customerRepository;
        private readonly IRepository<Representative> _representativeRepository;
        private readonly IChatQueueManager _queueManager;
        private static readonly object _queueLock = new object();


        public ChatSessionService(
            IChatSessionRepository repository,
            IRepository<Customer> customerRepository,
            IRepository<Topic> topicRepository,
            IChatQueueManager queueManager,
            IRepository<Representative> representativeRepository)
        {
            _repository = repository;
            _customerRepository = customerRepository;
            _representativeRepository = representativeRepository;
            _topicRepository = topicRepository;
            _queueManager = queueManager;
        }

        public List<ChatSessionDto> GetAllSessions()
        {
            return _repository.GetAll().Select(s => MapToDto(s)).ToList();
        }
        public List<ChatSessionDto> GetAllWaiting()
        {
            return _repository.GetAllWaiting().Select(s => MapToDto(s)).ToList();
        }
        public List<ChatSessionDto> GetAllActive()
        {
            return _repository.GetAllActive().Select(s => MapToDto(s)).ToList();

        }
        public ChatSessionDto GetSessionById(int id)
        {
            var s = _repository.GetById(id);
            return s == null ? null : MapToDto(s);
        }

        public ChatSessionDto AddSession(ChatSessionCreateDto dtoCust)
        {
            // בדיקה שהלקוח קיים
            var customerExists = _customerRepository.GetById(dtoCust.IDCustomer);
            var topic = _topicRepository.GetById(dtoCust.IDTopic);
            if (customerExists == null)
            {
                throw new Exception("לא ניתן לפתוח שיחה: הלקוח אינו קיים במערכת.");
            }
            var EstimatedWaitTime = CalculateWaitTime(topic.IDTopic);
            var session = new ChatSession
            {
                IDTopic = dtoCust.IDTopic,
                IDCustomer = dtoCust.IDCustomer,
                IDRepresentative = null, // שיחה חדשה בד"כ ללא נציג עדיין
                StartTimestamp = DateTime.Now,
                ServiceStartTimestamp = null,
                EndTimestamp = null,
                statusChat = SessionStatus.Waiting, // סטטוס ראשוני
                status = true,// מציינת שהשיחה פעילה במערכת
                EstimatedWaitTime = EstimatedWaitTime,
            };

            //  עדכון מונה הפניות של הנושא (לסטטיסטיקה עתידית)
            topic.totalSessionsCount++;
            _topicRepository.UpdateItem(topic.IDTopic, topic);
            var result = _repository.AddItem(session);
            // הוספה לתור בזיכרון מיד עם היצירה
            // ציון התחלתי הוא 0 כי הוא רק נכנס
            _queueManager.AddToQueue(result.SessionID, 0);
            return MapToDto(result);
        }

        public void UpdateSession(int id, ChatSessionUpdateDto dto)
        {
            var existingSession = _repository.GetById(id);
            if (existingSession != null)
            {
                existingSession.EndTimestamp = dto.EndTimestamp;
                existingSession.ServiceStartTimestamp = dto.ServiceStartTimestamp;
                existingSession.statusChat = dto.statusChat;
                existingSession.status = dto.status;
                existingSession.IDRepresentative = dto.IDRepresentative;
                existingSession.EstimatedWaitTime = dto.EstimatedWaitTime;
                _repository.UpdateItem(id, existingSession);
            }
        }

        public void DeleteSession(int id)
        {
            _repository.DeleteItem(id);
        }

        // פונקציית עזר למיפוי כדי למנוע כפל קוד
        private ChatSessionDto MapToDto(ChatSession s)
        {
            return new ChatSessionDto
            {
                SessionID = s.SessionID,
                IDTopic = s.IDTopic,
                IDCustomer = s.IDCustomer,
                IDRepresentative = s.IDRepresentative,
                StartTimestamp = s.StartTimestamp,
                ServiceStartTimestamp = s.ServiceStartTimestamp ?? DateTime.MinValue,
                EndTimestamp = s.EndTimestamp,
                status = s.status,
                statusChat = s.statusChat,
                EstimatedWaitTime = s.EstimatedWaitTime,
            };
        }
        public double CalculateWaitTime(int topicId)
        {
            var OnlineReps = _representativeRepository.GetAll().Where(r => r.IsOnline).ToList();
            if (!OnlineReps.Any())
                throw new InvalidOperationException("אין נציגים מחוברים למערכת כרגע. אנא נסה שוב מאוחר יותר.");
            var cntRep = OnlineReps.Count;
            var waitingSessions = _repository.GetAllWaiting();
            if (waitingSessions.Count != 0)
            {
                var lastSession = waitingSessions.Last();
                var avgTopic = _topicRepository.GetById(lastSession.IDTopic).AverageTreatTime;
                var EstimatedWaitTime = lastSession.EstimatedWaitTime;
                var myTopicPriorit = _topicRepository.GetById(topicId).priorityTopics;
                var timewait = (EstimatedWaitTime+(avgTopic/cntRep))*myTopicPriorit;
                return Math.Round(timewait, 1);
            }
            else
            {
                var acvivSessions = _repository.GetAllActive();
                if (acvivSessions.Count == 0)
                    return 0.5;
                else
                {
                    var min =_topicRepository.GetById( acvivSessions.First().IDTopic).AverageTreatTime;
                    var now = DateTime.Now;
                    foreach (var session in acvivSessions)
                    {
                        var minutes = (now - session.ServiceStartTimestamp.Value).TotalMinutes;
                        minutes=_topicRepository.GetById(session.IDTopic).AverageTreatTime - minutes;
                        if(minutes < min)
                            min = minutes;
                    }
                    if(min < 0.5)
                        min= 0.5;
                    return Math.Round(min, 1);

                }
            }

        }


        public ChatSessionDto PullNextClientForRepresentative(int idRepresentative)
        {
            lock (_queueLock)
            {
                var nextSession = _repository.GetNextWaitingSession();

                if (nextSession == null)
                    return null;
                nextSession.statusChat = SessionStatus.Active;
                nextSession.IDRepresentative = idRepresentative;
                nextSession.ServiceStartTimestamp = DateTime.Now;
                _repository.UpdateItem(nextSession.SessionID, nextSession);

                return MapToDto(nextSession);
            } // כאן הנעילה משתחררת והנציג הבא יכול להיכנס
        }
    }
}









//var currentSession = _repository.GetById(sessionId);
//if (currentSession == null || currentSession.statusChat != SessionStatus.Waiting) return 0;

//// 1. הכנת ה"סלוטים" של הנציגים (כמו מקודם)
//var representatives = _representativeRepository.GetAll().Where(r => r.IsOnline).ToList();
//if (!representatives.Any())
//{
//    throw new InvalidOperationException("אין נציגים מחוברים למערכת כרגע. אנא נסה שוב מאוחר יותר.");
//}
//var availableSlots = new List<double>();
//foreach (var rep in representatives)
//{
//    var activeSession = _repository.GetAll()
//        .FirstOrDefault(s => s.IDRepresentative == rep.IDRepresentative && s.statusChat == SessionStatus.Active);

//    if (activeSession == null)
//    {
//        availableSlots.Add(0);
//    }
//    else
//    {
//        var topic = _topicRepository.GetById(activeSession.IDTopic);
//        double timeSpent = (DateTime.Now - activeSession.ServiceStartTimestamp.Value).TotalMinutes;
//        double remaining = (topic?.AverageTreatTime ?? 10) - timeSpent;
//        availableSlots.Add(remaining > 0 ? remaining : 1);
//    }
//}

//// 2. שליפת כל הממתינים ומיון לפי עדיפות (החלק הקריטי!)
//// אנחנו נותנים "בונוס" של זמן למי שיש לו עדיפות גבוהה (Priority נמוך מספרית)
//var waitingQueue = _repository.GetAll()
//.Where(s => s.statusChat == SessionStatus.Waiting)
//.Select(s => {
//    var topic = _topicRepository.GetById(s.IDTopic);
//    double totalSecondsWaiting = (DateTime.Now - s.StartTimestamp).TotalSeconds;

//    // הציון הוא מכפלה של זמן ההמתנה במשקל העדיפות של הנושא
//    double priorityScore = totalSecondsWaiting * (topic?.priorityTopics ?? 1.0);

//    return new { Session = s, Score = priorityScore, Topic = topic };
//})
//.OrderByDescending(x => x.Score) // מי שהציון שלו הכי גבוה - הוא ראשון בתור
//.ToList();

//// 3. סימולציית שיבוץ לפי התור הממוין החדש
//availableSlots.Sort();
//int myIndex = waitingQueue.FindIndex(x => x.Session.SessionID == sessionId);

//for (int i = 0; i < myIndex; i++)
//{
//    var waitTopic = _topicRepository.GetById(waitingQueue[i].Session.IDTopic);
//    availableSlots[0] += (waitTopic?.AverageTreatTime ?? 10);
//    availableSlots.Sort(); // הנציג שסיים עכשיו "חוזר לסוף התור" של הנציגים
//}

//return Math.Round(availableSlots[0], 1);