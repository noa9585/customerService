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

        // הזרקת ה-Repository דרך הבנאי
        public ChatMessageService(IRepository<ChatMessage> repository)
        {
            _repository = repository;
        }

        public List<ChatMessageChatDto> GetAll()
        {
            var messages = _repository.GetAll();
            // מיפוי מרשימת ישויות לרשימת DTO
            return messages.Select(m => new ChatMessageChatDto
            {
                Message = m.Message,
                Timestamp = m.Timestamp,
                //IDSend = m.IDSend,
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
                //IDSend = m.IDSend,
                MessageType = m.MessageType
            };
        }

        public ChatMessageChatDto AddMessage(string message, int idSend, string messageType, int idRepresentative, int idCustomer)
        {
            var newMessage = new ChatMessage
            {
                Message = message,
                Timestamp = DateTime.Now, // נקבע בזמן יצירה
                IDSend = idSend,
                MessageType = messageType,
                IDRepresentative = idRepresentative,
                IDCustomer = idCustomer,
                StatusMessage = true // ברירת מחדל כמו ב-Topic
            };

            var savedMessage = _repository.AddItem(newMessage);

            return new ChatMessageChatDto
            {
                Message = savedMessage.Message,
                Timestamp = savedMessage.Timestamp,
                //IDSend = savedMessage.IDSend,
                MessageType = savedMessage.MessageType
            };
        }

        public void UpdateMessage(int id, string message, int idSend, string messageType, int idRepresentative, int idCustomer, bool statusMessage)
        {
            var existing = _repository.GetById(id);
            if (existing != null)
            {
                existing.Message = message;
                existing.IDSend = idSend;
                existing.MessageType = messageType;
                existing.IDRepresentative = idRepresentative;
                existing.IDCustomer = idCustomer;
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