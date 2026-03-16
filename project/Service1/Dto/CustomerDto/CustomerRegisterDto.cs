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
        [Required]
        [MaxLength(100)]
        public string NameCust { get; set; }
        [Required]
        [MaxLength(100)]
        public string EmailCust { get; set; }
        [Required]
        [MaxLength(50)]
        public string PasswordCust { get; set; }
       // public string? Role { get; set; }

    }
}
