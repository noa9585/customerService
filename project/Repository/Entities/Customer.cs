using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public class Customer
    {
        [Key]
        public int IDCustomer { get; set; }
        public string NameCust { get; set; }
        public string EmailCust { get; set; }
        public string PasswordCust { get; set; }
        public bool StatusCust { get; set; }

    }
}
