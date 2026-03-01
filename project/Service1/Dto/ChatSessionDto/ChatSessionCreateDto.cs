using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.ChatSessionDto
{
    public class ChatSessionCreateDto
    {
        public string Subject { get; set; }
        public int IDRepresentative { get; set; }
        public int IDCustomer { get; set; }
    }
}
