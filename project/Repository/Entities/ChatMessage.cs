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
    public class ChatMessage
    {
        [Key]

        public int MessageID { get; set; }
        public string Message { get; set; } // תוכן ההודעה
        public DateTime Timestamp { get; set; } // תאריך ושעת שליחת ההודעה
        public int IDSend {  get; set; } // מזהה שולח
        public string MessageType { get; set; } // סוג ההודעה (לקוח או נציג)
        public bool StatusMessage { get; set; }

        [ForeignKey("Representative")]
        public int IDRepresentative { get; set; } // מפתח זר לקשר עם Representative
        public virtual Representative Representative { get; set; } // קשר עם Representative

        [ForeignKey("Customer")]
        public int IDCustomer { get; set; }
        public virtual Customer Customer { get; set; }

    }
}
