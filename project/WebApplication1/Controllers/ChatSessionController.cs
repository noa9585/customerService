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
        public ChatSessionController(IChatSessionService chatSessionService, IChatQueueManager queueManager, IRepresentativeService representativeService)
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
        [HttpGet("/getWaiting")]
        public ActionResult<List<ChatSessionDto>> GetAllWaiting()
        {
            return Ok(_chatSessionService.GetAllWaiting());
        }
        [HttpGet("/getActive")]
        public ActionResult<List<ChatSessionDto>> getAllActive()
        {
            return Ok(_chatSessionService.GetAllActive());
        }
        [HttpGet("{id}")]
        public ActionResult<ChatSessionDto> Get(int id)
        {
            var session = _chatSessionService.GetSessionById(id);
            if (session == null) return NotFound();
            return Ok(session);
        }

        [HttpPost]
        public ActionResult Post([FromBody] ChatSessionCreateDto createDto)
        {
            if (createDto == null) return BadRequest();

            try
            {
                // 1. בדיקה מוקדמת - האם יש נציגים?
                if (!_representativeService.HasOnlineRepresentatives())
                {
                    return BadRequest(new { message = "אין נציגים מחוברים למערכת כרגע. אנא נסה שוב מאוחר יותר." });
                }

                // 2. יצירת הסשן (רק אם יש נציגים)
                var created = _chatSessionService.AddSession(createDto);

                //// 3. חישוב זמן המתנה ראשוני
                //double estimatedWait = _chatSessionService.CalculateWaitTime(created.SessionID);

                //// עדכון האובייקט שחוזר עם הזמן שחושב
                //created.EstimatedWaitTime = estimatedWait;

                return CreatedAtAction(nameof(Get), new { id = created.SessionID }, created);
            }
            catch (InvalidOperationException ex)
            {
                // תפיסת שגיאות לוגיות מה-Service (כמו תור מלא או בעיה בחישוב)
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // תפיסת שגיאות שרת כלליות מבלי להפיל את האפליקציה
                return StatusCode(500, new { message = "אירעה שגיאה פנימית בשרת", details = ex.Message });
            }
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

        [HttpPost("get-next-client/{idRepresentative}")]
        public IActionResult GetNextClient(int idRepresentative)
        {
            try
            {
                var sessionDto = _chatSessionService.PullNextClientForRepresentative(idRepresentative);
                if (sessionDto == null)
                {
                    return NotFound(new { message = "אין לקוחות ממתינים בתור כרגע." });
                }
                return Ok(sessionDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "אירעה שגיאה במשיכת הלקוח הבא.", details = ex.Message });
            }
        }
        [HttpPost("close-session/{idSession}")]
        public IActionResult CloseSession(int idSession)
        {
            try
            {
                _chatSessionService.EndChatSession(idSession);
                
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "אירעה שגיאה בסיום השיחה.", details = ex.Message });
            }
        }

    }
}