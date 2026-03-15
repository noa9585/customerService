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
        List<ChatSessionDto> GetAllSessions();
        ChatSessionDto GetSessionById(int id);
        List<ChatSessionDto> GetAllWaiting();
        List<ChatSessionDto> GetAllActive();
        // שימוש ב-DTO להוספה
        ChatSessionDto AddSession(ChatSessionCreateDto sessionDto);
        // שימוש ב-DTO לעדכון
        void UpdateSession(int id, ChatSessionUpdateDto sessionDto);
        void DeleteSession(int id);

        double CalculateWaitTime(int sessionId);
        ChatSessionDto PullNextClientForRepresentative(int idRepresentative);
        void EndChatSession(int sessionId);
        void CansleChatSession(int sessionId);

    }
}