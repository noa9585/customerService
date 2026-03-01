using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public class Topic
    {
        [Key]
        public int IDTopic { get; set; }
        public string NameTopic { get; set; }
        public double AverageTreatTime { get; set; }
        public int priorityTopics { get; set; }
        public bool StatusTopic {  get; set; }
        public int totalSessionsCount {  get; set; }
    }
}
