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

        public ChatMessageService(IRepository<ChatMessage> repository)
        {
            _repository = repository;
        }

        public List<ChatMessageChatDto> GetAll()
        {
            var messages = _repository.GetAll();
            return messages.Select(m => new ChatMessageChatDto
            {
                Message = m.Message,
                Timestamp = m.Timestamp,
                IDSend = m.IDSend,
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
                MessageType = m.MessageType
            };
        }

        public ChatMessageChatDto AddMessage(int iDSession, string message, int idSend, SenderType messageType)
        {
            var newMessage = new ChatMessage
            {
                IDSession = iDSession,
                Message = message,
                IDSend = idSend,
                MessageType = messageType,
                Timestamp = DateTime.Now,
                StatusMessage = true // הודעה חדשה נוצרת כפעילה
            };

            var savedMessage = _repository.AddItem(newMessage);

            return new ChatMessageChatDto
            {
                Message = savedMessage.Message,
                Timestamp = savedMessage.Timestamp,
                IDSend = savedMessage.IDSend,
                MessageType = savedMessage.MessageType
            };
        }

        public void UpdateMessage(int id, int iDSession, string message, int iDSend, SenderType messageType, bool statusMessage)
        {
            var existing = _repository.GetById(id);
            if (existing != null)
            {
                existing.IDSession = iDSession;
                existing.Message = message;
                existing.IDSend = iDSend;
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