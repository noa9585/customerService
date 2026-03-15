using System;
using System.Collections.Generic;
using Service1.Dto.ChatMessageDto;
using Repository.Entities; // עבור ה-Enum SenderType

namespace Service1.Interface
{
    public interface IChatMessageService
    {
        Task<List<ChatMessageDto>> GetAll();
        Task<ChatMessageChatDto> GetById(int id);
        Task<ChatMessageDto> AddMessage(int iDSession, string message, SenderType messageType);
        Task UpdateMessage(int id, int iDSession, string message, SenderType messageType, bool statusMessage);
        Task DeleteMessage(int id);
        Task<List<ChatMessageDto>> GetChatHistory(int sessionId);
    }
}