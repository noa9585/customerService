using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public class Customer
    {
        [Key]
        public int IDCustomer { get; set; }//ID
        [Required]
        [MaxLength(100)]
        public string NameCust { get; set; }//שם לקוח
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string EmailCust { get; set; }//מייל
        [Required]
        [MaxLength(50)]
        [MinLength(6)]
        public string PasswordCust { get; set; }//סיסמה
        public bool IsOnline { get; set; }//האם מחובר
        public bool StatusCust { get; set; }//סטטוס למחיקה
        [Required]
        [MaxLength(50)]
        public string Role { get; set; }//תפקיד
    }
}
