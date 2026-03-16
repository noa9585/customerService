using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Service1.Dto.ChatSessionDto;
using Service1.Interface;
using Service1.Logic;
using WebApplication1.Hubs;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatSessionController : ControllerBase
    {
        private readonly IChatSessionService _chatSessionService;
        private readonly IChatQueueManager _queueManager;
        private readonly IRepresentativeService _representativeService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatSessionController(IChatSessionService chatSessionService, IChatQueueManager queueManager, IRepresentativeService representativeService, IHubContext<ChatHub> hubContext)
        {
            _chatSessionService = chatSessionService;
            _queueManager = queueManager;
            _representativeService = representativeService;
            _hubContext = hubContext;
        }
        [Authorize(Roles = "Admin,Representative")]
        [HttpGet]
        public async Task<ActionResult<List<ChatSessionDto>>> GetAll()
        {
            return Ok(await _chatSessionService.GetAllSessions());
        }

        // שליפת כל הסשנים במצב "ממתין" (Waiting)
        [Authorize(Roles = "Admin,Representative")]
        [HttpGet("getWaiting")]
        public async Task<ActionResult<List<ChatSessionDto>>> GetAllWaiting()
        {
            return Ok(await _chatSessionService.GetAllWaiting());
        }

        // שליפת כל הסשנים במצב "פעיל" (Active)
        [Authorize(Roles = "Admin,Representative")]
        [HttpGet("getActive")]
        public async Task<ActionResult<List<ChatSessionDto>>> getAllActive()
        {
            return Ok(await _chatSessionService.GetAllActive());
        }

        //שליפת סשן לפי ID
        [Authorize(Roles = "Admin,Representative,Customer")]
        [HttpGet("{id}")]
        public async Task<ActionResult<ChatSessionDto>> Get(int id)
        {
            var session = await _chatSessionService.GetSessionById(id);
            if (session == null) return NotFound();
            return Ok(session);
        }


        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ChatSessionCreateDto createDto)
        {
            if (createDto == null) return BadRequest();

            try
            {
                // 1. בדיקה מוקדמת - האם יש נציגים?
                if (!await _representativeService.HasOnlineRepresentatives())
                {
                    return BadRequest(new { message = "אין נציגים מחוברים למערכת כרגע. אנא נסה שוב מאוחר יותר." });
                }

                // 2. יצירת הסשן (רק אם יש נציגים)
                var created = await _chatSessionService.AddSession(createDto);

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

        [Authorize(Roles = "Customer")]
        [HttpGet("estimate/{id}")]
        public async Task<ActionResult<double>> GetWaitTimeEstimate(int id)
        {
            try
            {
                double estimatedMinutes = await _chatSessionService.CalculateWaitTime(id);
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


        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] ChatSessionUpdateDto updateDto)
        {
            if (updateDto == null) return BadRequest();

            var session = await _chatSessionService.GetSessionById(id);
            if (session == null) return NotFound();

            await _chatSessionService.UpdateSession(id, updateDto);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var session = await _chatSessionService.GetSessionById(id);
            if (session == null) return NotFound();

            await _chatSessionService.DeleteSession(id);
            return NoContent();
        }

        [Authorize(Roles = "Representative")]
        [HttpPost("get-next-client/{id}")]
        public async Task<IActionResult> GetNextClient(int id)
        {
            try
            {
                // וודאי שה-id עובר נכון ל-Service
                var sessionDto = await _chatSessionService.PullNextClientForRepresentative(id);

                if (sessionDto == null)
                {
                    return NotFound(new { message = "אין לקוחות ממתינים בתור כרגע." });
                }
                await _hubContext.Clients.Group(sessionDto.SessionID.ToString()).SendAsync("SessionStarted", sessionDto);
                return Ok(sessionDto);
            }
            catch (Exception ex)
            {
                // כאן אנחנו "תופסים" את הקריסה ומחזירים את הסיבה האמיתית
                return StatusCode(500, new
                {
                    message = "אירעה שגיאה במשיכת הלקוח הבא.",
                    details = ex.Message, // זה יגיד לך אם זה Null Reference
                    inner = ex.InnerException?.Message
                });
            }
        }

        [Authorize(Roles = "Representative")]
        [HttpPost("close-session/{idSession}")]
        public async Task<IActionResult> CloseSession(int idSession)
        {
            try
            {
                await _chatSessionService.EndChatSession(idSession);
                await _hubContext.Clients.Group(idSession.ToString()).SendAsync("ChatEnded");

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "אירעה שגיאה בסיום השיחה.", details = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Customer")]
        [HttpPost("cancel-session/{idSession}")]
        public async Task<IActionResult> CancelSession(int idSession)
        {
            try
            {
                await _chatSessionService.CansleChatSession(idSession);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "אירעה שגיאה בביטול השיחה.", details = ex.Message });
            }
        }

    }
}