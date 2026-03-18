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
using AutoMapper;
using Service1.Dto.CustomerDto;
namespace Service1.Services
{
    public class RepresentativeService : IRepresentativeService
    {

        private readonly IRepresentativeRepository _repository;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IChatSessionService _chatSessionService;


        // הזרקת ה-Repository דרך הבנאי
        public RepresentativeService(IRepresentativeRepository repository, ITokenService tokenService, IMapper mapper, IChatSessionService chatSessionService)
        {
            _repository = repository;
            _tokenService = tokenService;
            _mapper = mapper;
            _chatSessionService = chatSessionService;  
        }

        public async Task<List<RepresentativeDto>> GetAll()
        {
            var representatives = await _repository.GetAll();
            // מיפוי מרשימת ישויות לרשימת DTO
            return _mapper.Map<List<RepresentativeDto>>(representatives);

        }
        public async Task<List<RepresentativeDto>> GetAllPending()
        {
            var representatives = await _repository.GetAllPending();
            // מיפוי מרשימת ישויות לרשימת DTO
            return _mapper.Map<List<RepresentativeDto>>(representatives);

        }
        public async Task<RepresentativeDto> GetById(int id)
        {
            var r = await _repository.GetById(id);
            if (r == null) return null;

            return _mapper.Map<RepresentativeDto>(r);
        }
        public async Task<RepresentativeUpdateDto> GetByIdToUpdate(int id)
        {
            var r = await _repository.GetById(id);
            if (r == null) return null;

            return new RepresentativeUpdateDto
            {
                EmailRepr = r.EmailRepr,
                NameRepr = r.NameRepr,
                PasswordRepr = r.PasswordRepr,
            };
        }
        public async Task<RepresentativeDto> AddRepresentative(string name, string email, string passward)
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

            var savedRepresentative = await _repository.AddItem(newRepresentative);
            Console.WriteLine(savedRepresentative.IDRepresentative);
            return _mapper.Map<RepresentativeDto>(savedRepresentative);
        }


        public async Task UpdateRepresentative(int id, string name, string email, string passward)
        {
            var existing = await _repository.GetById(id);
            if (existing != null)
            {
                existing.EmailRepr = email;
                existing.NameRepr = name;
                existing.PasswordRepr = passward;
                await _repository.UpdateItem(id, existing);
            }
        }
        public async Task DeleteRepresentative(int id)
        {
            await _repository.DeleteItem(id);
        }

        public async Task<RepresentativeDto> Login(RepresentativeLoginDto loginDto)
        {
            var representative = (await _repository.GetAll())
                .FirstOrDefault(r => r.EmailRepr == loginDto.EmailRepr && r.PasswordRepr == loginDto.PasswordRepr);
            if (representative == null) return null;
            if (representative.Role == "Waiting")
                throw new InvalidOperationException("WAITING");

            if (representative.Role == "Denied")
                throw new InvalidOperationException("DENIED");
            var today = DateOnly.FromDateTime(DateTime.Now);
            var currentTime = TimeOnly.FromDateTime(DateTime.Now);

            var newWorkSession = new WorkTime(today, currentTime);
            representative.LHours.Add(newWorkSession);
            // עדכון סטטוס ל-Online
            representative.IsOnline = true;

            // שמירת השינויים בבסיס הנתונים
            await _repository.UpdateItem(representative.IDRepresentative, representative);
            await _chatSessionService.RecalculateAllWaitingTimes();

            // החזרת הנתונים המעודכנים
            var dto = _mapper.Map<RepresentativeDto>(representative);
            dto.Token = _tokenService.GenerateTokenForRepresentative(representative);
            return dto;
        }
        // בתוך IRepresentativeService.cs
        public async Task<RepresentativeDto> Register(RepresentativeRegisterDto registerDto)
        {
            // 1. בדיקה אם קיים נציג עם אותו אימייל
            var existing = (await _repository.GetAll())
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
                Role = "Waiting",
                // הגדרת שעות עבודה ראשוניות (ניתן לעדכון בהמשך ע"י מנהל)
                entryHourRepr = new TimeOnly(8, 0),
                exitHourRepr = new TimeOnly(16, 0)
            };

            // 3. שמירה ב-Repository
            var savedRep = await _repository.AddItem(newRep);

            // 4. החזרת DTO נקי (ללא סיסמה)
            var dto = _mapper.Map<RepresentativeDto>(savedRep);
            //dto.Token = _tokenService.GenerateTokenForRepresentative(savedRep);
            return dto;
        }
        public async Task Logout(int id)
        {
            var representative = await _repository.GetById(id);
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

            await _repository.UpdateItem(id, representative);
            await _chatSessionService.RecalculateAllWaitingTimes();

        }
        public async Task ToggleBreak(int id)
        {
            var representative = await _repository.GetById(id);
            if (representative != null)
            {
                representative.IsOnline = false;
                representative.IsBusy = false;

                await _repository.UpdateItem(id, representative);
                await _chatSessionService.RecalculateAllWaitingTimes();

            }
        }
        public async Task ReturnFromBreak(int id)
        {
            var representative = await _repository.GetById(id);
            if (representative != null)
            {
                representative.IsOnline = true;
                representative.IsBusy = false;

                await _repository.UpdateItem(id, representative);
                await _chatSessionService.RecalculateAllWaitingTimes();

            }
        }
        public async Task<bool> HasOnlineRepresentatives()
        {
            return (await _repository.GetAll()).Any(r => r.IsOnline && r.StatusRepr);
        }
        public async Task ApproveRepresentative(int id)
        {
            var representative = await _repository.GetById(id);
            if (representative == null) throw new Exception("נציג לא נמצא");
            if (representative.Role != "Waiting") throw new InvalidOperationException("הנציג אינו ממתין לאישור");
            representative.Role = "Representative";
            await _repository.UpdateItem(id, representative);
        }
        public async Task DenyRepresentative(int id)
        {
            var representative = await _repository.GetById(id);
            if (representative == null) throw new Exception("נציג לא נמצא");
            if (representative.Role != "Waiting") throw new InvalidOperationException("הנציג אינו ממתין לאישור");
            representative.Role = "Denied";
            representative.StatusRepr = true;
            await _repository.UpdateItem(id, representative);
        }

    }
}