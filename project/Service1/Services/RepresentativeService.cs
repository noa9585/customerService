using Repository.Entities;
using Repository.interfaces; // וודאי שזה השם המדויק של ה-Namespace
using Service1.Dto.RepresentativeDto;
using Service1.Dto.TopicDto;
using Service1.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Service1.Services
{
    public class RepresentativeService : IRepresentativeService
    {

        private readonly IRepository<Representative> _repository;
        private readonly ITokenService _tokenService;

        // הזרקת ה-Repository דרך הבנאי
        public RepresentativeService(IRepository<Representative> repository,ITokenService tokenService)
        {
            _repository = repository;
            _tokenService = tokenService;
        }

        public List<RepresentativeDto> GetAll()
        {
            var representatives = _repository.GetAll();
            // מיפוי מרשימת ישויות לרשימת DTO
            return representatives.Select(r => new RepresentativeDto
            {
                IDRepresentative = r.IDRepresentative,
                EmailRepr = r.EmailRepr,
                NameRepr = r.NameRepr,
                entryHourRepr = r.entryHourRepr,
                exitHourRepr = r.exitHourRepr,
                IsBusy = r.IsBusy,
                IsOnline = r.IsOnline,
                ScoreForMonth = r.ScoreForMonth,
                StatusRepr = r.StatusRepr,
                Role = r.Role,
            }).ToList();
        }


        public RepresentativeDto GetById(int id)
        {
            var r = _repository.GetById(id);
            if (r == null) return null;

            return new RepresentativeDto
            {
                IDRepresentative = r.IDRepresentative,
                EmailRepr = r.EmailRepr,
                NameRepr = r.NameRepr,
                entryHourRepr = r.entryHourRepr,
                exitHourRepr = r.exitHourRepr,
                IsBusy = r.IsBusy,
                IsOnline = r.IsOnline,
                ScoreForMonth = r.ScoreForMonth,
                StatusRepr = r.StatusRepr,
                Role = r.Role,
            };
        }
        public RepresentativeUpdateDto GetByIdToUpdate(int id)
        {
            var r = _repository.GetById(id);
            if (r == null) return null;

            return new RepresentativeUpdateDto
            {
                EmailRepr = r.EmailRepr,
                NameRepr = r.NameRepr,
                PasswordRepr=r.PasswordRepr,
            };
        }
        public RepresentativeDto AddRepresentative(string name, string email, string passward)
        {
            var newRepresentative = new Representative
            {

                NameRepr = name,
                EmailRepr = email,
                PasswordRepr = passward,
                ScoreForMonth = 0,
                entryHourRepr = new TimeOnly(),
                exitHourRepr = new TimeOnly(),
                StatusRepr = true,
                IsOnline = false,
                IsBusy = false,
                LHours = new List<WorkTime>(),
                Role = "Representative"
            };

            var savedRepresentative = _repository.AddItem(newRepresentative);
            Console.WriteLine(savedRepresentative.IDRepresentative);
            return new RepresentativeDto
            {
                IDRepresentative = savedRepresentative.IDRepresentative,
                EmailRepr = savedRepresentative.EmailRepr,
                NameRepr = savedRepresentative.NameRepr,
            };
        }


        public void UpdateRepresentative(int id, string name, string email, string passward)
        {
            var existing = _repository.GetById(id);
            if (existing != null)
            {
                existing.EmailRepr = email;
                existing.NameRepr = name;
                existing.PasswordRepr = passward;
                _repository.UpdateItem(id, existing);
            }
        }





        public void DeleteRepresentative(int id)
        {
            _repository.DeleteItem(id);
        }

        public RepresentativeDto Login(RepresentativeLoginDto loginDto)
        {
            // חיפוש הנציג לפי אימייל וסיסמה מתוך ה-DTO
            var representative = _repository.GetAll()
                .FirstOrDefault(r => r.EmailRepr == loginDto.EmailRepr && r.PasswordRepr == loginDto.PasswordRepr);

            if (representative == null) return null;

           
            var today = DateOnly.FromDateTime(DateTime.Now);
            var currentTime = TimeOnly.FromDateTime(DateTime.Now);

            var newWorkSession = new WorkTime(today, currentTime);
            representative.LHours.Add(newWorkSession);
            // עדכון סטטוס ל-Online
            representative.IsOnline = true;

            // שמירת השינויים בבסיס הנתונים
            _repository.UpdateItem(representative.IDRepresentative, representative);

            // החזרת הנתונים המעודכנים
            return new RepresentativeDto
            {
                IDRepresentative = representative.IDRepresentative,
                NameRepr = representative.NameRepr,
                EmailRepr = representative.EmailRepr,
                IsOnline = representative.IsOnline,
                IsBusy = representative.IsBusy,
                entryHourRepr = representative.entryHourRepr, 
                exitHourRepr = representative.exitHourRepr,
                Role = "Representative",
                Token=_tokenService.GenerateTokenForRepresentative(representative)
            };
        }
        // בתוך IRepresentativeService.cs
        public RepresentativeDto Register(RepresentativeRegisterDto registerDto)
        {
            // 1. בדיקה אם קיים נציג עם אותו אימייל
            var existing = _repository.GetAll()
                .FirstOrDefault(r => r.EmailRepr == registerDto.EmailRepr);

            if (existing != null)
            {
                throw new Exception("נציג עם אימייל זה כבר קיים במערכת");
            }

            // 2. יצירת ישות נציג חדשה עם ערכי ברירת מחדל
            var newRep = new Representative
            {
                NameRepr = registerDto.NameRepr,
                EmailRepr = registerDto.EmailRepr,
                PasswordRepr = registerDto.PasswordRepr, // נשמר ב-DB אך לא יוחזר ב-DTO
                StatusRepr = true,
                IsOnline = false,
                IsBusy = false,
                ScoreForMonth = 0,
                LHours = new List<WorkTime>(),
                Role = "Representative",
                // הגדרת שעות עבודה ראשוניות (ניתן לעדכון בהמשך ע"י מנהל)
                entryHourRepr = new TimeOnly(8, 0),
                exitHourRepr = new TimeOnly(16, 0)
            };

            // 3. שמירה ב-Repository
            var savedRep = _repository.AddItem(newRep);

            // 4. החזרת DTO נקי (ללא סיסמה)
            return new RepresentativeDto
            {
                IDRepresentative = savedRep.IDRepresentative,
                NameRepr = savedRep.NameRepr,
                EmailRepr = savedRep.EmailRepr,
                Role = "Representative",
                Token = _tokenService.GenerateTokenForRepresentative(savedRep)
            };
        }
        public void Logout(int id)
        {
            var representative = _repository.GetById(id);
            if (representative == null) return;

            // עדכון הסטטוסים
            representative.IsOnline = false;
            representative.IsBusy = false;

            var lastEntry = representative.LHours.LastOrDefault();

            if (lastEntry != null)
            {
                //  עדכון שעת היציאה באובייקט שנמצא בתוך הרשימה
                lastEntry.SetExitHourRepr(TimeOnly.FromDateTime(DateTime.Now));
            }

            _repository.UpdateItem(id, representative);
        }
        public void ToggleBreak(int id)
        {
            var representative = _repository.GetById(id);
            if (representative != null)
            {
                representative.IsOnline = false;
                representative.IsBusy = false;

                _repository.UpdateItem(id, representative);
            }
        }
        public void ReturnFromBreak(int id)
        {
            var representative = _repository.GetById(id);
            if (representative != null)
            {
                representative.IsOnline = true;
                representative.IsBusy = false;

                _repository.UpdateItem(id, representative);
            }
        }
        public bool HasOnlineRepresentatives()
        {
            // בודק אם יש לפחות נציג אחד שמוגדר כ-Online
            return _repository.GetAll().Any(r => r.IsOnline && r.StatusRepr);
        }
    }
}
