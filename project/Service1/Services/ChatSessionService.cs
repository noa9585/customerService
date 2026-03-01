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
            return _repository.GetAll().Select(s => MapToDto(s)).ToList();
        }

        public ChatSessionDto GetSessionById(int id)
        {
            var s = _repository.GetById(id);
            return s == null ? null : MapToDto(s);
        }

        public ChatSessionDto AddSession(ChatSessionCreateDto dto)
        {
            // בדיקה שהלקוח קיים
            var customerExists = _customerRepository.GetById(dto.IDCustomer);
            if (customerExists == null)
            {
                throw new Exception("לא ניתן לפתוח שיחה: הלקוח אינו קיים במערכת.");
            }

            var session = new ChatSession
            {
                IDTopic = dto.IDTopic,
                IDCustomer = dto.IDCustomer,
                IDRepresentative = null, // שיחה חדשה בד"כ ללא נציג עדיין
                StartTimestamp = DateTime.Now,
                ServiceStartTimestamp = null,
                EndTimestamp = null,
                statusChat = SessionStatus.Waiting, // סטטוס ראשוני
                status = true // מציינת שהשיחה פעילה במערכת
            };

            var result = _repository.AddItem(session);
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
                // הערה: אם תרצה לכלול את ה-Objects המלאים (Customer/Topic), יש לוודא שהם נטענים ב-Repository
            };
        }
    }
}