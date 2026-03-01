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
        public int IDRepresentative { get; set; }
        public string NameRepr { get; set; }
        public string EmailRepr { get; set; }
        public string PasswordRepr { get; set; }
   
    }
}
