using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.ChatSessionDto
{
    public class ChatSessionUpdateDto
    {
        public DateTime? EndTimestamp { get; set; }
        public bool ChatStatus { get; set; }
    }
}