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
        public string Message { get; set; } // תוכן ההודעה
    }
}
