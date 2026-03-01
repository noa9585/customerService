using Repository.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.ChatSessionDto
{
    public class ChatSessionCreateDto
    {
        public int IDCustomer { get; set; }
        public int IDTopic { get; set; }
    }
}









