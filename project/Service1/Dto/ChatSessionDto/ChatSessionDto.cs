using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service1.Dto.ChatMessageDto;
namespace Service1.Dto.ChatSessionDto
{
    public class ChatSessionDto
    {
        [Key]
        public int SessionID { get; set; }
        public List<ChatMessageChatDto> Messages { get; set; }// רשימת הודעות
        public string Subject { get; set; } // נושא השיחה
        public DateTime StartTimestamp { get; set; } // תאריך ושעת התחלת השיחה
        public DateTime? EndTimestamp { get; set; } // תאריך ושעת סיום השיחה
        public bool ChatStatus { get; set; } // מצב השיחה
        public int IDRepresentative { get; set; }
        //public virtual Representative Representative { get; set; }
        public int IDCustomer { get; set; }
        //public virtual Customer Customer { get; set; }
    }
}
