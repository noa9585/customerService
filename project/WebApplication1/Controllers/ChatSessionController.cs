using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Repository.interfaces;
using Service1.Dto.ChatSessionDto;
using Service1.Interface;
using WebApplication1.Hubs;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatSessionController : ControllerBase
    {
        private readonly IChatSessionService _chatSessionService;
        private readonly IRepresentativeService _representativeService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatSessionController(IChatSessionService chatSessionService, IRepresentativeService representativeService, IHubContext<ChatHub> hubContext)
        {
            _chatSessionService = chatSessionService;
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
        //עדכון זמני ההמתנה של השיחות הממתינות
        [Authorize(Roles = "Admin,Representative,Customer")]
        [HttpPut("Recalculate")]
        public async Task RecalculateAndNotify()
        {
            await _chatSessionService.RecalculateAllWaitingTimes(); // מחשב ושומר
            var sessions = await _chatSessionService.GetAllWaiting(); //שולף את הרשימה המעודכנת
            await _hubContext.Clients.All.SendAsync("WaitingTimesUpdated", sessions);
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
        //שליפת שיחה הבאה
        [Authorize(Roles = "Representative")]
        [HttpPost("get-next-client/{id}")]
        public async Task<IActionResult> GetNextClient(int id)
        {
            try
            {
                var sessionDto = await _chatSessionService.PullNextClientForRepresentative(id);

                if (sessionDto == null)
                {
                    return NotFound(new { message = "אין לקוחות ממתינים בתור כרגע." });
                }
                await _hubContext.Clients.Group(sessionDto.SessionID.ToString()).SendAsync("SessionStarted", sessionDto);
                var updatedSessions = await _chatSessionService.GetAllWaiting();
                await _hubContext.Clients.All.SendAsync("WaitingTimesUpdated", updatedSessions);
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
        //סגירת שיחה
        [Authorize(Roles = "Representative")]
        [HttpPost("close-session/{idSession}")]
        public async Task<IActionResult> CloseSession(int idSession)
        {
            try
            {
                await _chatSessionService.EndChatSession(idSession);
                await _hubContext.Clients.Group(idSession.ToString()).SendAsync("ChatEnded");
                var updatedSessions = await _chatSessionService.GetAllWaiting();
                await _hubContext.Clients.All.SendAsync("WaitingTimesUpdated", updatedSessions);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "אירעה שגיאה בסיום השיחה.", details = ex.Message });
            }
        }
        //ביטול שיחה
        [Authorize(Roles = "Admin,Customer")]
        [HttpPost("cancel-session/{idSession}")]
        public async Task<IActionResult> CancelSession(int idSession)
        {
            try
            {
                await _chatSessionService.CansleChatSession(idSession);
                var updatedSessions = await _chatSessionService.GetAllWaiting();
                await _hubContext.Clients.All.SendAsync("WaitingTimesUpdated", updatedSessions);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "אירעה שגיאה בביטול השיחה.", details = ex.Message });
            }
        }

    }
}