using System;
using System.Collections.Generic;
using System.Linq;
using Repository.Entities;
using Repository.interfaces;
using Service1.Dto.ChatMessageDto;
using Service1.Interface;
using AutoMapper;

namespace Service1.Services
{
    public class ChatMessageService : IChatMessageService
    {
        private readonly IChatMessageRepository _repository;
        private readonly IChatSessionRepository _sessionRepository; // הוספת השורה הזו
        private readonly IMapper _mapper;


        // עדכון הבנאי לקבלת שני הפרמטרים
        public ChatMessageService(IChatMessageRepository repository, IChatSessionRepository sessionRepository, IMapper mapper)
        {
            _repository = repository;
            _sessionRepository = sessionRepository;
            _mapper = mapper;
        }

        public List<ChatMessageDto> GetAll()
        {
            var messages = _repository.GetAll();
            return _mapper.Map<List<ChatMessageDto>>(messages);
        }

        public ChatMessageChatDto GetById(int id)
        {
            var m = _repository.GetById(id);
            if (m == null) return null;

            return _mapper.Map<ChatMessageChatDto>(m);
        }

        public ChatMessageDto AddMessage(int iDSession, string message, SenderType messageType)
        {
            var session = _sessionRepository.GetById(iDSession);

            if (session == null)
            {
                throw new Exception("Session not found"); // הגנה למקרה שה-ID לא קיים
            }
            var newMessage = new ChatMessage
            {
                IDSession = iDSession,
                Message = message,
                MessageType = messageType,
                Timestamp = DateTime.Now,
                StatusMessage = true, // הודעה חדשה נוצרת כפעילה
                IDSend = messageType == SenderType.Customer ? session.IDCustomer : session.IDRepresentative ?? 0
            };

            var savedMessage = _repository.AddItem(newMessage);

            return _mapper.Map<ChatMessageDto>(savedMessage);
        }


    

        public void UpdateMessage(int id, int iDSession, string message, SenderType messageType, bool statusMessage)
        {
            var session = _sessionRepository.GetById(iDSession);

            if (session == null)
            {
                throw new Exception("Session not found"); // הגנה למקרה שה-ID לא קיים
            }
            var existing = _repository.GetById(id);
            if (existing != null)
            {
                existing.IDSession = iDSession;
                existing.Message = message;
                existing.IDSend = messageType == SenderType.Customer ? session.IDCustomer : session.IDRepresentative ?? 0;
                existing.MessageType = messageType;
                existing.StatusMessage = statusMessage;

                _repository.UpdateItem(id, existing);
            }
        }

        public void DeleteMessage(int id)
        {
            _repository.DeleteItem(id);
        }
        public List<ChatMessageDto> GetChatHistory(int sessionId)
        {
            var messages = _repository.GetMessagesBySessionId(sessionId);
            return _mapper.Map<List<ChatMessageDto>>(messages);
        }
    }
}