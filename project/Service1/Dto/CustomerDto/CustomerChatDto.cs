using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.CustomerDto
{
    public class CustomerChatDto
    {
        public int IDCustomer { get; set; }
        public string NameCust { get; set; }
        public string EmailCust { get; set; }
        public bool isOnline { get; set; }
        public string? Role { get; set; }
        public string? Token { get; set; }



    }
}


