using Repository.Entities;
using Service1.Dto.ChatMessageDto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Service1.Dto.ChatSessionDto
{
    public class ChatSessionDto
    {
        [Key]
        public int SessionID { get; set; }



        public virtual List<ChatMessage> Messages { get; set; }// רשימת הודעות
        public DateTime StartTimestamp { get; set; } // תאריך ושעת פתיחת פניה 
        public DateTime ServiceStartTimestamp { get; set; } // תאריך ושעת התחלת עם נציג
        public DateTime? EndTimestamp { get; set; } // תאריך ושעת סיום השיחה

        public SessionStatus statusChat { get; set; } // מצב השיחה
        public bool status { get; set; }
        public int? IDRepresentative { get; set; }
        public int IDCustomer { get; set; }
        public int IDTopic { get; set; }
    }
}
