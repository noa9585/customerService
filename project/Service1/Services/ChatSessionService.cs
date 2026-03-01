using Repository.Entities;
using Repository.interfaces;
using Service1.Dto.ChatSessionDto;
using Service1.Interface;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Service1.Services
{
    public class ChatSessionService : IChatSessionService
    {
        private readonly IRepository<ChatSession> _repository;
        private readonly IRepository<Customer> _customerRepository;
        private readonly IRepository<Representative> _representativeRepository;

        // הבנאי מקבל את כל המרכיבים הנחוצים מה-Program.cs
        public ChatSessionService(
            IRepository<ChatSession> repository,
            IRepository<Customer> customerRepository,
            IRepository<Representative> representativeRepository)
        {
            _repository = repository;
            _customerRepository = customerRepository;
            _representativeRepository = representativeRepository;
        }

        public List<ChatSessionDto> GetAllSessions()
        {
            return _repository.GetAll().Select(s => new ChatSessionDto
            {
                SessionID = s.SessionID,
                Subject = s.Subject,
                StartTimestamp = s.StartTimestamp,
                EndTimestamp = s.EndTimestamp,
                ChatStatus = s.ChatStatus,
                IDCustomer = s.IDCustomer,
                IDRepresentative = s.IDRepresentative
            }).ToList();
        }

        public ChatSessionDto GetSessionById(int id)
        {
            var s = _repository.GetById(id);
            if (s == null) return null;

            return new ChatSessionDto
            {
                SessionID = s.SessionID,
                Subject = s.Subject,
                StartTimestamp = s.StartTimestamp,
                EndTimestamp = s.EndTimestamp,
                ChatStatus = s.ChatStatus,
                IDCustomer = s.IDCustomer,
                IDRepresentative = s.IDRepresentative
            };
        }

        public ChatSessionDto AddSession(ChatSessionCreateDto dto)
        {
            // בדיקה ששני הצדדים קיימים ב-DB למניעת קריסה בשמירה
            var customerExists = _customerRepository.GetById(dto.IDCustomer);
            var representativeExists = _representativeRepository.GetById(dto.IDRepresentative);

            if (customerExists == null || representativeExists == null)
            {
                throw new Exception("לא ניתן לפתוח שיחה: הלקוח או הנציג אינם קיימים במערכת.");
            }

            var session = new ChatSession
            {
                Subject = dto.Subject,
                IDCustomer = dto.IDCustomer,
                IDRepresentative = dto.IDRepresentative,
                StartTimestamp = DateTime.Now,
                ChatStatus = true // שיחה חדשה מתחילה תמיד כפעילה
            };

            // הוספה למסד הנתונים דרך ה-Repository
            var result = _repository.AddItem(session);

            return new ChatSessionDto
            {
                SessionID = result.SessionID,
                Subject = result.Subject,
                IDCustomer = result.IDCustomer,
                IDRepresentative = result.IDRepresentative,
                StartTimestamp = result.StartTimestamp,
                ChatStatus = result.ChatStatus
            };
        }

        public void UpdateSession(int id, ChatSessionUpdateDto dto)
        {
            var existingSession = _repository.GetById(id);
            if (existingSession != null)
            {
                existingSession.EndTimestamp = dto.EndTimestamp;
                existingSession.ChatStatus = dto.ChatStatus;

                _repository.UpdateItem(id, existingSession);
            }
        }

        public void DeleteSession(int id)
        {
            _repository.DeleteItem(id);
        }
    }
}