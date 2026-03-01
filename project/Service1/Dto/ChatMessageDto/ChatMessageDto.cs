using Repository.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.ChatMessageDto
{
    public  class ChatMessageDto
    {
        public int MessageID { get; set; }
        public int IDSession { get; set; } // קישור לשיחה
        public string Message { get; set; } // תוכן ההודעה
        public DateTime Timestamp { get; set; } // תאריך ושעת שליחת ההודעה
        public int IDSend { get; set; } // מזהה שולח
        public SenderType MessageType { get; set; } // סוג ההודעה (לקוח או נציג)
        public bool StatusMessage { get; set; }
    }
}
