using AutoMapper;
using Repository.Entities;
using Repository.interfaces;
using Service1.Dto.ChatSessionDto;
using Service1.Interface;
using Service1.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using static System.Collections.Specialized.BitVector32;
namespace Service1.Services
{
    public class ChatSessionService : IChatSessionService
    {
        private readonly IChatSessionRepository _repository;
        private readonly IRepository<Topic> _topicRepository;
        private readonly IRepository<Customer> _customerRepository;
        private readonly IRepository<Representative> _representativeRepository;
        private readonly IChatQueueManager _queueManager;
        private readonly IMapper _mapper;
        private static readonly object _queueLock = new object();


        public ChatSessionService(
               IChatSessionRepository repository,
               IRepository<Customer> customerRepository,
               IRepository<Topic> topicRepository,
               IChatQueueManager queueManager,
               IMapper mapper, // הוספה לבנאי
               IRepository<Representative> representativeRepository)
        {
            _repository = repository;
            _customerRepository = customerRepository;
            _representativeRepository = representativeRepository;
            _topicRepository = topicRepository;
            _queueManager = queueManager;
            _mapper = mapper; // אתחול
        }

        public List<ChatSessionDto> GetAllSessions()
        {
            var sessions = _repository.GetAll();
            return _mapper.Map<List<ChatSessionDto>>(sessions);
        }
        public List<ChatSessionDto> GetAllWaiting()
        {
            var waitingSessions = _repository.GetAllWaiting();
            return _mapper.Map<List<ChatSessionDto>>(waitingSessions);
        }
        public List<ChatSessionDto> GetAllActive()
        {
            var activeSessions = _repository.GetAllActive();
            return _mapper.Map<List<ChatSessionDto>>(activeSessions);
        }
        public ChatSessionDto GetSessionById(int id)
        {
            var session = _repository.GetById(id);
            if (session == null) return null;
            return _mapper.Map<ChatSessionDto>(session);
        }

        public ChatSessionDto AddSession(ChatSessionCreateDto sessionDto)
        {
            // בדיקה שהלקוח קיים
            var customerExists = _customerRepository.GetById(sessionDto.IDCustomer);
            var topic = _topicRepository.GetById(sessionDto.IDTopic);
            if (customerExists == null)
            {
                throw new Exception("לא ניתן לפתוח שיחה: הלקוח אינו קיים במערכת.");
            }
            var EstimatedWaitTime = CalculateWaitTime(topic.IDTopic);
            var session = _mapper.Map<ChatSession>(sessionDto);
            session.StartTimestamp = DateTime.Now;
            session.statusChat = SessionStatus.Waiting;
            session.status = true;
            topic.totalSessionsCount++;
            _topicRepository.UpdateItem(topic.IDTopic, topic);
            var result = _repository.AddItem(session);
            result.EstimatedWaitTime = EstimatedWaitTime;
            _repository.UpdateItem(result.SessionID, result);
            // הוספה לתור בזיכרון מיד עם היצירה
            // ציון התחלתי הוא 0 כי הוא רק נכנס
            //_queueManager.AddToQueue(result.SessionID, 0);
            return _mapper.Map<ChatSessionDto>(result);
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
                var timewait = (EstimatedWaitTime + (avgTopic / cntRep)) * myTopicPriorit;
                return Math.Round(timewait, 1);
            }
            else
            {
                var acvivSessions = _repository.GetAllActive();
                if (acvivSessions.Count == 0)
                    return 0.5;
                else
                {
                    var min = _topicRepository.GetById(acvivSessions.First().IDTopic).AverageTreatTime;
                    var now = DateTime.Now;
                    foreach (var session in acvivSessions)
                    {
                        var minutes = (now - session.ServiceStartTimestamp.Value).TotalMinutes;
                        minutes = _topicRepository.GetById(session.IDTopic).AverageTreatTime - minutes;
                        if (minutes < min)
                            min = minutes;
                    }
                    if (min < 0.5)
                        min = 0.5;
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
                var rep = _representativeRepository.GetById(idRepresentative);
                if (rep != null)
                {
                    rep.IsBusy = true;
                    _representativeRepository.UpdateItem(idRepresentative, rep);
                }
                return _mapper.Map<ChatSessionDto>(nextSession);
            } // כאן הנעילה משתחררת והנציג הבא יכול להיכנס
        }
        public void EndChatSession(int sessionId)
        {
            var session = _repository.GetById(sessionId);
            if (session == null)
                throw new Exception("שיחת הצ'אט לא נמצאה.");
            session.EndTimestamp = DateTime.Now;
            session.statusChat = SessionStatus.Close;
            _repository.UpdateItem(sessionId, session);
            var rep = _representativeRepository.GetById(session.IDRepresentative.Value);
            if (rep != null)
            {
                rep.IsBusy = false;
                rep.ScoreForMonth += 7;
                _representativeRepository.UpdateItem(rep.IDRepresentative, rep);
            }
            var totalMinutes = (session.EndTimestamp - session.ServiceStartTimestamp)?.TotalMinutes ?? 0;
            var topic = _topicRepository.GetById(session.IDTopic);
            var newAvg = (topic.AverageTreatTime * (topic.totalSessionsCount - 1) + totalMinutes) / topic.totalSessionsCount;
            topic.AverageTreatTime = newAvg;
            _topicRepository.UpdateItem(topic.IDTopic, topic);
        }
        public void CansleChatSession(int sessionId)
        {
            var session = _repository.GetById(sessionId);
            if (session == null)
                throw new Exception("שיחת הצ'אט לא נמצאה.");
            session.statusChat = SessionStatus.Cancel;
            session.EndTimestamp = DateTime.Now;
            _repository.UpdateItem(sessionId, session);
            var topic = _topicRepository.GetById(session.IDTopic);
            topic.totalSessionsCount--;
            _topicRepository.UpdateItem(topic.IDTopic, topic);
        }
    }
}








