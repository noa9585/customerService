using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public enum SessionStatus { Waiting,Active,Close}
    public class ChatSession
    {
        [Key]
        public int SessionID {  get; set; }
        


        public virtual List<ChatMessage> Messages { get; set; }// רשימת הודעות
        public DateTime StartTimestamp { get; set; } // תאריך ושעת פתיחת פניה 
        public DateTime? ServiceStartTimestamp { get; set; } // תאריך ושעת התחלת עם נציג
        public DateTime? EndTimestamp { get; set; } // תאריך ושעת סיום השיחה

        public SessionStatus statusChat { get; set; } // מצב השיחה
        public bool status { get; set; }
        public int? IDRepresentative { get; set; }
        [ForeignKey("IDRepresentative")]

        public virtual Representative Representative { get; set; }
        public int IDCustomer { get; set; }
        [ForeignKey("IDCustomer")]

        public virtual Customer Customer { get; set; }
        public int IDTopic { get; set; }
        [ForeignKey("IDTopic")]

        public virtual Topic Topic { get; set; }

    }
}
