using Microsoft.AspNetCore.Mvc;
using Repository.Entities;
using Service1.Dto.ChatSessionDto;
using Service1.Interface;
using Service1.Logic;
using Service1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatSessionController : ControllerBase
    {
        private readonly IChatSessionService _chatSessionService;
        private readonly IChatQueueManager _queueManager;
        private readonly IRepresentativeService _representativeService;
        public ChatSessionController(IChatSessionService chatSessionService,IChatQueueManager queueManager, IRepresentativeService representativeService)
        {
            _chatSessionService = chatSessionService;
            _queueManager = queueManager;
            _representativeService = representativeService;
        }

        [HttpGet]
        public ActionResult<List<ChatSessionDto>> GetAll()
        {
            return Ok(_chatSessionService.GetAllSessions());
        }

        [HttpGet("{id}")]
        public ActionResult<ChatSessionDto> Get(int id)
        {
            var session = _chatSessionService.GetSessionById(id);
            if (session == null) return NotFound();
            return Ok(session);
        }

        //[HttpPost]
        //public ActionResult<ChatSessionDto> Post([FromBody] ChatSessionCreateDto createDto)
        //{
        //    if (createDto == null) return BadRequest();

        //    var created = _chatSessionService.AddSession(createDto);
        //    return CreatedAtAction(nameof(Get), new { id = created.SessionID }, created);
        //}


        [HttpPost]
        public ActionResult<ChatSessionDto> Post([FromBody] ChatSessionCreateDto createDto)
        {
            if (createDto == null) return BadRequest();

            // יצירת השיחה
            var created = _chatSessionService.AddSession(createDto);

            // שליפת זמן ההמתנה המשוער עבור השיחה החדשה שנוצרה
            double estimatedWait = _chatSessionService.CalculateWaitTime(created.SessionID);

            // אפשר להוסיף את הנתון הזה ל-Header או לעטוף באובייקט תשובה
            return CreatedAtAction(nameof(Get), new { id = created.SessionID }, new
            {
                Session = created,
                EstimatedWaitMinutes = estimatedWait
            });
        }

        [HttpGet("estimate/{id}")]
        public ActionResult<double> GetWaitTimeEstimate(int id)
        {
            try
            {
                double estimatedMinutes = _chatSessionService.CalculateWaitTime(id);
                return Ok(estimatedMinutes);
            }
            catch (InvalidOperationException ex)
            {
                // כאן נתפסת השגיאה של "אין נציגים מחוברים"
                // מחזירים BadRequest (400) או ServiceUnavailable (503) עם הודעת השגיאה
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // שגיאות כלליות אחרות
                return StatusCode(500, new { message = "אירעה שגיאה פנימית בחישוב הזמן", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] ChatSessionUpdateDto updateDto)
        {
            if (updateDto == null) return BadRequest();

            var session = _chatSessionService.GetSessionById(id);
            if (session == null) return NotFound();

            _chatSessionService.UpdateSession(id, updateDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var session = _chatSessionService.GetSessionById(id);
            if (session == null) return NotFound();

            _chatSessionService.DeleteSession(id);
            return NoContent();
        }

        [HttpPost("get-next-client/{repId}")]
        public ActionResult GetNextClient(int repId)
        {
            // 1. בדיקה קריטית: האם הנציג קיים ב-DB?
            // זה ימנע את השגיאה שראינו ב-Inner Exception
            var representative = _representativeService.GetById(repId);
            if (representative == null)
            {
                return BadRequest(new { message = $"שגיאת מערכת: נציג מס' {repId} לא נמצא במסד הנתונים." });
            }

            // 2. משיכת הלקוח הבא מהתור
            int? nextSessionId = _queueManager.GetNextSession();

            if (nextSessionId == null) return NotFound(new { message = "התור ריק." });

            // 3. עדכון השיחה לשיוך לנציג הקיים
            var session = _chatSessionService.GetSessionById(nextSessionId.Value);
            if (session != null)
            {
                var updateDto = new ChatSessionUpdateDto
                {
                    IDRepresentative = repId, // עכשיו אנחנו בטוחים שהוא קיים
                    statusChat = SessionStatus.Active,
                    ServiceStartTimestamp = DateTime.Now,
                    status = true
                };
                _chatSessionService.UpdateSession(nextSessionId.Value, updateDto);
            }

            return Ok(session);
        }
    }
}