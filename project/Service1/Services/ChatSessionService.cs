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
        public void EndChatSession(int sessionId)
        {
            var session = _repository.GetById(sessionId);
            if (session == null)
                throw new Exception("שיחת הצ'אט לא נמצאה.");
            session.EndTimestamp= DateTime.Now;
            session.statusChat = SessionStatus.Close;
            _repository.UpdateItem(sessionId,session);
            var rep= _representativeRepository.GetById(session.IDRepresentative.Value);
            if (rep != null)
                {
                rep.IsBusy = false;
                rep.ScoreForMonth+= 7; 
                _representativeRepository.UpdateItem(rep.IDRepresentative, rep);
            }
            var totalMinutes= (session.EndTimestamp - session.ServiceStartTimestamp)?.TotalMinutes ?? 0;
            var topic= _topicRepository.GetById(session.IDTopic);
            var newAvg=(topic.AverageTreatTime*(topic.totalSessionsCount-1)+totalMinutes)/topic.totalSessionsCount;
            topic.AverageTreatTime = newAvg;
            _topicRepository.UpdateItem(topic.IDTopic, topic);
        }
        public void CansleChatSession(int sessionId)
        {
            var session = _repository.GetById(sessionId);
            if (session == null)
                throw new Exception("שיחת הצ'אט לא נמצאה.");
            session.statusChat= SessionStatus.Cancel;
            session.EndTimestamp = DateTime.Now;
            _repository.UpdateItem(sessionId, session);
             var topic = _topicRepository.GetById(session.IDTopic);
            topic.totalSessionsCount--; 
            _topicRepository.UpdateItem(topic.IDTopic, topic);
        }
    }
}








