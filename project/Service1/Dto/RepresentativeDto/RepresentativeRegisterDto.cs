using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.RepresentativeDto
{
    public class RepresentativeRegisterDto
    {
        [Required]
        [MaxLength(100)]
        public string NameRepr { get; set; }
        [Required]
        [MaxLength(100)]
        public string EmailRepr { get; set; }
        [Required]
        [MaxLength(50)]
        public string PasswordRepr { get; set; }
    }
}
