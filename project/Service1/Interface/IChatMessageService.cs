using System;
using System.Collections.Generic;
using Service1.Dto.ChatMessageDto;
using Repository.Entities; // עבור ה-Enum SenderType

namespace Service1.Interface
{
    public interface IChatMessageService
    {
        List<ChatMessageChatDto> GetAll();
        ChatMessageChatDto GetById(int id);

        // הוספה: מחזיר את האובייקט שנוצר
        ChatMessageDto AddMessage(int iDSession, string message, SenderType messageType);

        // עדכון: הוספתי id כדי שנדע איזו הודעה לעדכן
        void UpdateMessage(int id, int iDSession, string message, SenderType messageType, bool statusMessage);

        void DeleteMessage(int id);
    }
}