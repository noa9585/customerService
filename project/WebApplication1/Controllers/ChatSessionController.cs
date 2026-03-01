using Microsoft.AspNetCore.Mvc;
using Service1.Interface;
using Service1.Dto.ChatSessionDto;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatSessionController : ControllerBase
    {
        private readonly IChatSessionService _chatSessionService;

        public ChatSessionController(IChatSessionService chatSessionService)
        {
            _chatSessionService = chatSessionService;
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

        [HttpPost]
        public ActionResult<ChatSessionDto> Post([FromBody] ChatSessionCreateDto createDto)
        {
            if (createDto == null) return BadRequest();

            var created = _chatSessionService.AddSession(createDto);
            return CreatedAtAction(nameof(Get), new { id = created.SessionID }, created);
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
    }
}