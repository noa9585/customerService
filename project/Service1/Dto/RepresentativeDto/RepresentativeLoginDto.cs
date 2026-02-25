using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.RepresentativeDto
{
    public class RepresentativeLoginDto
    {
        public string EmailRepr { get; set; }
        public string PasswordRepr { get; set; }
        public TimeOnly entryHourRepr { get; set; }
        public TimeOnly exitHourRepr { get; set; }
    }
}
