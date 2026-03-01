using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.ChatMessageDto
{
    public class ChatMessageChatDto
    {
        public string Message { get; set; } // תוכן ההודעה
        public DateTime Timestamp { get; set; } // תאריך ושעת שליחת ההודעה
      //  public int IDSend { get; set; } // מזהה שולח
        public string MessageType { get; set; } // סוג ההודעה (לקוח או נציג)
    }
}
