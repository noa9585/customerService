using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.RepresentativeDto
{
    public class RepresentativeDto
    {
        public int IDRepresentative { get; set; }
        public string NameRepr { get; set; }
        public string EmailRepr { get; set; }
        public int ScoreForMonth { get; set; }
        public TimeOnly entryHourRepr { get; set; }
        public TimeOnly exitHourRepr { get; set; }
        public bool StatusRepr { get; set; }
        public bool IsOnline { get; set; }
        public bool IsBusy { get; set; }
        public string Role { get; set; }
        public string? Token { get; set; }

    }
}
