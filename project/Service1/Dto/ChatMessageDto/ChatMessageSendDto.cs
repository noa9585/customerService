using Repository.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.ChatMessageDto
{
    public class ChatMessageSendDto
    {
        [Required]
        [MaxLength(500)]
        public string Message { get; set; } // תוכן ההודעה
        public int IDSession { get; set; }//קישור לשיחה
        public DateTime Timestamp { get; set; } // תאריך ושעת שליחת ההודעה
        public SenderType MessageType { get; set; } // סוג ההודעה (לקוח או נציג)
    }
}
