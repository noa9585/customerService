using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service1.Dto.ChatMessageDto;

namespace Service1.Interface
{
    public interface IChatMessageService
    {
        List<ChatMessageChatDto> GetAll();
        ChatMessageChatDto GetById(int id);
        // הוספה על בסיס הפרמטרים של הישות
        ChatMessageChatDto AddMessage(string message, int idSend, string messageType, int idRepresentative, int idCustomer);
        // עדכון על בסיס הפרמטרים של הישות
        void UpdateMessage(int id, string message, int idSend, string messageType, int idRepresentative, int idCustomer, bool statusMessage);
        void DeleteMessage(int id);
    }
}