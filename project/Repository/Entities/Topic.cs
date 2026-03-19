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
        public int IDTopic { get; set; }//ID
        [Required]
        [MaxLength(200)]
        public string NameTopic { get; set; }//שם נושא
        public double AverageTreatTime { get; set; }//זמן טיפול ממוצע
        public double priorityTopics { get; set; }//עדיפות
        public bool StatusTopic { get; set; }//סטטוס למחיקה
        public int totalSessionsCount { get; set; }//כמות שיחות לנושא 
    }
}
