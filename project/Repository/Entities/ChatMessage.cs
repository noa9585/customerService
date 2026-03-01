using Repository.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public enum SenderType { Customer, Representative }
    public class ChatMessage
    {
        [Key]

        public int MessageID { get; set; }
        public int IDSession { get; set; } // קישור לשיחה
        [ForeignKey("IDSession")]

        public virtual ChatSession ChatSession { get; set; }

        public string Message { get; set; } // תוכן ההודעה
        public DateTime Timestamp { get; set; } // תאריך ושעת שליחת ההודעה
        public int IDSend {  get; set; } // מזהה שולח
        public SenderType MessageType { get; set; } // סוג ההודעה (לקוח או נציג)
        public bool StatusMessage { get; set; }

    

    }
}
