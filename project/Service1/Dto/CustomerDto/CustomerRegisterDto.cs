using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.CustomerDto
{
    public class CustomerRegisterDto
    {
        public string NameCust { get; set; }
        public string EmailCust { get; set; }
        public string PasswordCust { get; set; }
    }
}
