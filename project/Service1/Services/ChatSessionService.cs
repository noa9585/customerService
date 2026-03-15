
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
        private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

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

        public async Task<List<ChatSessionDto>> GetAllSessions()
        {
            var sessions = await _repository.GetAll();
            return _mapper.Map<List<ChatSessionDto>>(sessions);
        }
        public async Task<List<ChatSessionDto>> GetAllWaiting()
        {
            var waitingSessions = await _repository.GetAllWaiting();
            return _mapper.Map<List<ChatSessionDto>>(waitingSessions);
        }
        public async Task<List<ChatSessionDto>> GetAllActive()
        {
            var activeSessions = await _repository.GetAllActive();
            return _mapper.Map<List<ChatSessionDto>>(activeSessions);
        }
        public async Task<ChatSessionDto> GetSessionById(int id)
        {
            var session = await _repository.GetById(id);
            if (session == null) return null;
            return _mapper.Map<ChatSessionDto>(session);
        }

        public async Task<ChatSessionDto> AddSession(ChatSessionCreateDto sessionDto)
        {
            // בדיקה שהלקוח קיים
            var customerExists = await _customerRepository.GetById(sessionDto.IDCustomer);
            var topic = await _topicRepository.GetById(sessionDto.IDTopic);
            if (customerExists == null)
            {
                throw new Exception("לא ניתן לפתוח שיחה: הלקוח אינו קיים במערכת.");
            }
            var EstimatedWaitTime = await CalculateWaitTime(topic.IDTopic);
            var session = _mapper.Map<ChatSession>(sessionDto);
            session.StartTimestamp = DateTime.Now;
            session.statusChat = SessionStatus.Waiting;
            session.status = true;
            topic.totalSessionsCount++;
            await _topicRepository.UpdateItem(topic.IDTopic, topic);
            var result = await _repository.AddItem(session);
            result.EstimatedWaitTime = EstimatedWaitTime;
            await _repository.UpdateItem(result.SessionID, result);
            // הוספה לתור בזיכרון מיד עם היצירה
            // ציון התחלתי הוא 0 כי הוא רק נכנס
            //_queueManager.AddToQueue(result.SessionID, 0);
            return _mapper.Map<ChatSessionDto>(result);
        }

        public async Task UpdateSession(int id, ChatSessionUpdateDto dto)
        {
            var existingSession = await _repository.GetById(id);
            if (existingSession != null)
            {
                existingSession.EndTimestamp = dto.EndTimestamp;
                existingSession.ServiceStartTimestamp = dto.ServiceStartTimestamp;
                existingSession.statusChat = dto.statusChat;
                existingSession.status = dto.status;
                existingSession.IDRepresentative = dto.IDRepresentative;
                existingSession.EstimatedWaitTime = dto.EstimatedWaitTime;
                await _repository.UpdateItem(id, existingSession);
            }
        }

        public async Task DeleteSession(int id)
        {
            await _repository.DeleteItem(id);
        }


        public async Task<double> CalculateWaitTime(int topicId)
        {
            var OnlineReps = (await _representativeRepository.GetAll()).Where(r => r.IsOnline).ToList();
            if (!OnlineReps.Any())
                throw new InvalidOperationException("אין נציגים מחוברים למערכת כרגע. אנא נסה שוב מאוחר יותר.");
            var cntRep = OnlineReps.Count;
            var waitingSessions = await _repository.GetAllWaiting();
            if (waitingSessions.Count != 0)
            {
                var lastSession = waitingSessions.Last();
                var avgTopic = (await _topicRepository.GetById(lastSession.IDTopic)).AverageTreatTime;
                var EstimatedWaitTime = lastSession.EstimatedWaitTime;
                var myTopicPriorit = (await _topicRepository.GetById(topicId)).priorityTopics;
                var timewait = (EstimatedWaitTime + (avgTopic / cntRep)) * myTopicPriorit;
                return Math.Round(timewait, 1);
            }
            else
            {
                var acvivSessions = await _repository.GetAllActive();
                if (acvivSessions.Count == 0)
                    return 0.5;
                else
                {
                    var min = (await _topicRepository.GetById(acvivSessions.First().IDTopic)).AverageTreatTime;
                    var now = DateTime.Now;
                    foreach (var session in acvivSessions)
                    {
                        var minutes = (now - session.ServiceStartTimestamp.Value).TotalMinutes;
                        minutes = (await _topicRepository.GetById(session.IDTopic)).AverageTreatTime - minutes;
                        if (minutes < min)
                            min = minutes;
                    }
                    if (min < 0.5)
                        min = 0.5;
                    return Math.Round(min, 1);

                }
            }

        }


        public async Task<ChatSessionDto> PullNextClientForRepresentative(int idRepresentative)
        {
            await _semaphore.WaitAsync();
            try
            {
                var nextSession = await _repository.GetNextWaitingSession();

                if (nextSession == null)
                    return null;
                nextSession.statusChat = SessionStatus.Active;
                nextSession.IDRepresentative = idRepresentative;
                nextSession.ServiceStartTimestamp = DateTime.Now;
                await _repository.UpdateItem(nextSession.SessionID, nextSession);
                var rep = await _representativeRepository.GetById(idRepresentative);
                if (rep != null)
                {
                    rep.IsBusy = true;
                    await _representativeRepository.UpdateItem(idRepresentative, rep);
                }
                return _mapper.Map<ChatSessionDto>(nextSession);
            }
            finally
            {
                _semaphore.Release(); // שחרור הנעילה תמיד!
            }
        }
        public async Task EndChatSession(int sessionId)
        {
            var session = await _repository.GetById(sessionId);
            if (session == null)
                throw new Exception("שיחת הצ'אט לא נמצאה.");
            session.EndTimestamp = DateTime.Now;
            session.statusChat = SessionStatus.Close;
            await _repository.UpdateItem(sessionId, session);
            var rep = await _representativeRepository.GetById(session.IDRepresentative.Value);
            if (rep != null)
            {
                rep.IsBusy = false;
                rep.ScoreForMonth += 7;
                await _representativeRepository.UpdateItem(rep.IDRepresentative, rep);
            }
            var totalMinutes = (session.EndTimestamp - session.ServiceStartTimestamp)?.TotalMinutes ?? 0;
            var topic = await _topicRepository.GetById(session.IDTopic);
            var newAvg = (topic.AverageTreatTime * (topic.totalSessionsCount - 1) + totalMinutes) / topic.totalSessionsCount;
            topic.AverageTreatTime = newAvg;
            await _topicRepository.UpdateItem(topic.IDTopic, topic);
        }
        public async Task CansleChatSession(int sessionId)
        {
            var session = await _repository.GetById(sessionId);
            if (session == null)
                throw new Exception("שיחת הצ'אט לא נמצאה.");
            session.statusChat = SessionStatus.Cancel;
            session.EndTimestamp = DateTime.Now;
            await _repository.UpdateItem(sessionId, session);
            var topic = await _topicRepository.GetById(session.IDTopic);
            topic.totalSessionsCount--;
            await _topicRepository.UpdateItem(topic.IDTopic, topic);
        }
    }
}








