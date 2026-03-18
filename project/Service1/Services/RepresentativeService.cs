using Repository.Entities;
using Repository.interfaces; 
using Service1.Dto.RepresentativeDto;
using Service1.Interface;
using AutoMapper;
namespace Service1.Services
{
    public class RepresentativeService : IRepresentativeService
    {
        private readonly IRepresentativeRepository _repository;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IChatSessionService _chatSessionService;

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
            return _mapper.Map<List<RepresentativeDto>>(representatives);

        }
        // שליפת כל הנציגים במצב "ממתין" (Waiting)
        public async Task<List<RepresentativeDto>> GetAllPending()
        {
            var representatives = await _repository.GetAllPending();
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
        //התחברות לאתר
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
            representative.IsOnline = true;

            // שמירת השינויים בבסיס הנתונים
            await _repository.UpdateItem(representative.IDRepresentative, representative);
            await _chatSessionService.RecalculateAllWaitingTimes();

            // החזרת הנתונים המעודכנים
            var dto = _mapper.Map<RepresentativeDto>(representative);
            dto.Token = _tokenService.GenerateTokenForRepresentative(representative);
            return dto;
        }
        //הרשמה לאתר
        public async Task<RepresentativeDto> Register(RepresentativeRegisterDto registerDto)
        {
            // בדיקה שלא קיים כזה אימייל בדאטה
            var existing = (await _repository.GetAll())
                .FirstOrDefault(r => r.EmailRepr == registerDto.EmailRepr);

            if (existing != null)
            {
                throw new Exception("נציג עם אימייל זה כבר קיים במערכת");
            }

            var newRep = new Representative
            {
                NameRepr = registerDto.NameRepr,
                EmailRepr = registerDto.EmailRepr,
                PasswordRepr = registerDto.PasswordRepr,
                StatusRepr = true,
                IsOnline = false,
                IsBusy = false,
                ScoreForMonth = 0,
                LHours = new List<WorkTime>(),
                Role = "Waiting",
                //הגדרת שעות עבודה ראשוניות (במקרה ויום אחד הפרויקט יתפתח...)
                entryHourRepr = new TimeOnly(8, 0),
                exitHourRepr = new TimeOnly(16, 0)
            };

            var savedRep = await _repository.AddItem(newRep);
            var dto = _mapper.Map<RepresentativeDto>(savedRep);
            //מי שנרשם שיהיה בלי טוקן כדי שלא יכנס למערכת
            //dto.Token = _tokenService.GenerateTokenForRepresentative(savedRep);
            return dto;
        }
        //יציאה מהאתר
        public async Task Logout(int id)
        {
            var representative = await _repository.GetById(id);
            if (representative == null) return;
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
        //פונקציית יציאה להפסקה, הנציג נמצא במערכת אבל לא פנוי לקבל שיחות
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
        //פונקציית חזרה מההפסקה, הנציג חוזר להיות פנוי לקבל שיחות
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
        //האם קיים נציג שעובד עכשיו
        public async Task<bool> HasOnlineRepresentatives()
        {
            return (await _repository.GetAll()).Any(r => r.IsOnline && r.StatusRepr);
        }
        //אישור נציג ע"י מנהל
        public async Task ApproveRepresentative(int id)
        {
            var representative = await _repository.GetById(id);
            if (representative == null) throw new Exception("נציג לא נמצא");
            if (representative.Role != "Waiting") throw new InvalidOperationException("הנציג אינו ממתין לאישור");
            representative.Role = "Representative";
            await _repository.UpdateItem(id, representative);
        }
        //דחיית נציג ע"י מנהל
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