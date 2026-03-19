using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public class WorkTime//מחלקה פנימית לשמירת המשמרות
    {
        [Key]
        public int Id { get; set; }
        public TimeOnly entryHourRepr { get; set; }//שעת כניסה
        public TimeOnly exitHourRepr { get; set; }//שעת יציאה
        public DateOnly WorkDate { get; set; }//תאריך משמרת
        public WorkTime() { }
        public WorkTime(DateOnly WorkDate, TimeOnly entryHourRepr)
        {
            this.WorkDate = WorkDate;
            this.entryHourRepr = entryHourRepr;
        }
        public void SetExitHourRepr(TimeOnly exitHourRepr) { this.exitHourRepr = exitHourRepr; }
    }
    public class Representative
    {
        [Key]
        public int IDRepresentative { get; set; }//ID
        [Required]
        [MaxLength(100)]
        public string NameRepr { get; set; }//שם
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string EmailRepr { get; set; }//מייל
        [Required]
        [MaxLength(50)]
        [MinLength(6)]
        public string PasswordRepr { get; set; }//סיסמה
        public List<WorkTime> LHours { get; set; }//רשימה של משמרות שעשה-ימי עבודה
        public int ScoreForMonth { get; set; }//ניקוד
        public TimeOnly entryHourRepr { get; set; }//שעת תחילת משמרת במקור 
        public TimeOnly exitHourRepr { get; set; }//שעת סיום משמרת במקור 
        public bool StatusRepr { get; set; } //סטטוס למחיקה
        public bool IsOnline { get; set; }//האם מחובר
        public bool IsBusy { get; set; }//האם משוחח עם לקוח
        [Required]
        [MaxLength(50)]
        public string Role { get; set; }//תפקיד
    }
}