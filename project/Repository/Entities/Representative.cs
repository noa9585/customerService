using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public class Representative
    {
        [Key]
        public int IDRepresentative { get; set; }
        public string NameRepr { get; set; }
        public string EmailRepr { get; set; }
        public string PasswordRepr { get; set; }
        public int ScoreForMonth { get; set; }
        public TimeOnly entryHourRepr { get; set; }
        public TimeOnly exitHourRepr { get; set; }
        public bool StatusRepr { get; set; }
        // האם הנציג ביצע Login למערכת כרגע?
        public bool IsOnline { get; set; }

        // האם הנציג נמצא בשיחה פעילה כרגע?
        public bool IsBusy { get; set; }

    }
}
