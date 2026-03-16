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
        [Required]
        [MaxLength(100)]
        public string NameCust { get; set; }

        [Required]
        [MaxLength(100)]
        public string EmailCust { get; set; }

        [Required]
        [MaxLength(50)]
        public string PasswordCust { get; set; }
        public bool IsOnline { get; set; }
        public bool StatusCust { get; set; }
        [Required]
        [MaxLength(50)]
        public string Role { get; set; }

    }
}
