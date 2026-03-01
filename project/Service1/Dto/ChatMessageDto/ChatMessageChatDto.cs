using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Entities;
namespace Service1.Dto.ChatMessageDto
{
    public class ChatMessageChatDto
    {

        public string Message { get; set; } // תוכן ההודעה
        public int IDSession {  get; set; }//קישור לשיחה
        public DateTime Timestamp { get; set; } // תאריך ושעת שליחת ההודעה
        public int IDSend { get; set; } // מזהה שולח
        public SenderType MessageType { get; set; } // סוג ההודעה (לקוח או נציג)
    }
}
