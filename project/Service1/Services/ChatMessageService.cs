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

        public async Task<List<ChatMessageDto>> GetAll()
        {
            var messages = await _repository.GetAll();
            return _mapper.Map<List<ChatMessageDto>>(messages);
        }

        public async Task<ChatMessageChatDto> GetById(int id)
        {
            var m =await _repository.GetById(id);
            if (m == null) return null;

            return _mapper.Map<ChatMessageChatDto>(m);
        }

        public async Task<ChatMessageDto> AddMessage(int iDSession, string message, SenderType messageType)
        {
            var session = await _sessionRepository.GetById(iDSession);

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

            var savedMessage =await _repository.AddItem(newMessage);

            return _mapper.Map<ChatMessageDto>(savedMessage);
        }


    

        public async Task UpdateMessage(int id, int iDSession, string message, SenderType messageType, bool statusMessage)
        {
            var session =await _sessionRepository.GetById(iDSession);

            if (session == null)
            {
                throw new Exception("Session not found"); // הגנה למקרה שה-ID לא קיים
            }
            var existing =await _repository.GetById(id);
            if (existing != null)
            {
                existing.IDSession = iDSession;
                existing.Message = message;
                existing.IDSend = messageType == SenderType.Customer ? session.IDCustomer : session.IDRepresentative ?? 0;
                existing.MessageType = messageType;
                existing.StatusMessage = statusMessage;

               await _repository.UpdateItem(id, existing);
            }
        }

        public async Task DeleteMessage(int id)
        {
           await _repository.DeleteItem(id);
        }
        public  async Task<List<ChatMessageDto>> GetChatHistory(int sessionId)
        {
            var messages = await _repository.GetMessagesBySessionId(sessionId);
            return _mapper.Map<List<ChatMessageDto>>(messages);
        }
    }
}