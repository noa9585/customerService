using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service1.Dto.ChatSessionDto;

namespace Service1.Interface
{
    public interface IChatSessionService
    {
        Task<List<ChatSessionDto>> GetAllSessions();
        Task<ChatSessionDto> GetSessionById(int id);
        Task<List<ChatSessionDto>> GetAllWaiting();
        Task<List<ChatSessionDto>> GetAllActive();
        Task<ChatSessionDto> AddSession(ChatSessionCreateDto sessionDto);
        Task UpdateSession(int id, ChatSessionUpdateDto sessionDto);
        Task DeleteSession(int id);
        Task<double> CalculateWaitTime(int sessionId);
        Task<ChatSessionDto> PullNextClientForRepresentative(int idRepresentative);
        Task EndChatSession(int sessionId);
        Task CansleChatSession(int sessionId);
    }
}