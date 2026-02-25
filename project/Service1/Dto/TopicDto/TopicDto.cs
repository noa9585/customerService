using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Dto.TopicDto
{
    public class TopicDto
    {
        public int IDTopics { get; set; }
        public string NameTopic { get; set; }
        public double AverageTreatTime { get; set; }
        public int priorityTopics { get; set; }
        public bool StatusTopic { get; set; }
    }
}
