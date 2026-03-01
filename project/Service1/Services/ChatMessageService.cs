using System;
using System.Collections.Generic;
using System.Linq;
using Repository.Entities;
using Repository.interfaces;
using Service1.Dto.ChatMessageDto;
using Service1.Interface;

namespace Service1.Services
{
    public class ChatMessageService : IChatMessageService
    {
        private readonly IRepository<ChatMessage> _repository;
        private readonly IRepository<ChatSession> _sessionRepository; // הוספת השורה הזו

        // עדכון הבנאי לקבלת שני הפרמטרים
        public ChatMessageService(IRepository<ChatMessage> repository, IRepository<ChatSession> sessionRepository)
        {
            _repository = repository;
            _sessionRepository = sessionRepository;
        }

        public List<ChatMessageDto> GetAll()
        {
            var messages = _repository.GetAll();
            return messages.Select(m => new ChatMessageDto
            {
                MessageID = m.MessageID,
                Message = m.Message,
                Timestamp = m.Timestamp,
                IDSend = m.IDSend,
                IDSession = m.IDSession,
                MessageType = m.MessageType
            }).ToList();
        }

        public ChatMessageChatDto GetById(int id)
        {
            var m = _repository.GetById(id);
            if (m == null) return null;

            return new ChatMessageChatDto
            {
                Message = m.Message,
                Timestamp = m.Timestamp,
                IDSend = m.IDSend,
                MessageType = m.MessageType,
                IDSession = m.IDSession
                
            };
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

            return new ChatMessageDto
            {
                MessageID = savedMessage.MessageID,
                IDSession = iDSession,
                IDSend= savedMessage.IDSend,
                Message = savedMessage.Message,
                Timestamp = savedMessage.Timestamp,
                MessageType = savedMessage.MessageType,
                StatusMessage= savedMessage.StatusMessage
            };
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
    }
}