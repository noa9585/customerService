using Microsoft.AspNetCore.Mvc;
using Service1.Interface;
using Service1.Dto.RepresentativeDto;
using Microsoft.AspNetCore.Authorization;
namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepresentativeController : ControllerBase
    {
        private readonly IRepresentativeService _representativeService;

        public RepresentativeController(IRepresentativeService representativeService)
        {
            _representativeService = representativeService;
        }
        // שליפת כל הנציגים
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RepresentativeChatDto>>> GetAll()
        {
            return Ok(await _representativeService.GetAll());
        }
        // שליפת נציג לפי ID
        [HttpGet("{id}")]
        public async Task<ActionResult<RepresentativeChatDto>> GetById(int id)
        {
            var representative = await _representativeService.GetById(id);
            if (representative == null)
            {
                return NotFound($"Representative with ID {id} not found.");
            }
            return Ok(representative);
        }


        [HttpGet("updateByID/{id}")]
        public async Task<ActionResult<RepresentativeChatDto>> GetByIdToUpdate(int id)
        {
            var representative = await _representativeService.GetByIdToUpdate(id);
            if (representative == null)
            {
                return NotFound($"Representative with ID {id} not found.");
            }
            return Ok(representative);
        }
        // הוספת נציג חדש
        [HttpPost]
        public async Task<ActionResult<RepresentativeDto>> Add([FromBody] RepresentativeRegisterDto representativeDto)
        {
            if (representativeDto == null)
            {
                return BadRequest();
            }

            var newrepresentative = await _representativeService.AddRepresentative(representativeDto.NameRepr, representativeDto.EmailRepr, representativeDto.PasswordRepr);
            return CreatedAtAction(nameof(GetById), new { id = newrepresentative.IDRepresentative }, newrepresentative);
        }
        // עדכון נציג קיים
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RepresentativeRegisterDto representativeDto)
        {
            var existing = await _representativeService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _representativeService.UpdateRepresentative(id, representativeDto.NameRepr, representativeDto.EmailRepr, representativeDto.PasswordRepr);
            return NoContent();
        }

        // מחיקת נציג
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _representativeService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _representativeService.DeleteRepresentative(id);
            return NoContent();
        }
        //התחברות
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<RepresentativeDto>> Login([FromBody] RepresentativeLoginDto loginDto)
        {
            if (loginDto == null) return BadRequest("נתוני התחברות חסרים");

            var result = await _representativeService.Login(loginDto);

            if (result == null)
            {
                return Unauthorized("אימייל או סיסמה שגויים");
            }

            return Ok(result);
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<RepresentativeDto>> Register([FromBody] RepresentativeRegisterDto regDto)
        {
            if (regDto == null) return BadRequest("נתונים חסרים");

            try
            {
                var result = await _representativeService.Register(regDto);
                // החזרת קוד 201 Created עם הנתיב לשליפת הנציג
                return CreatedAtAction(nameof(GetById), new { id = result.IDRepresentative }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("logout/{id}")]
        public async Task<IActionResult> Logout(int id)
        {
            var representative = await _representativeService.GetById(id);
            if (representative == null)
            {
                return NotFound("נציג לא נמצא");
            }

            await _representativeService.Logout(id);
            return Ok(new { message = "התנתקת בהצלחה" });
        }
        [HttpPut("ToggleBreak/{id}")]
        public async Task<IActionResult> ToggleBreak(int id)
        {
            var existing = await _representativeService.GetById(id);
            if (existing == null)
            {
                return NotFound("נציג לא נמצא");
            }

            await _representativeService.ToggleBreak(id);
            return Ok(new { message = "יצאת להפסקה בהצלחה" });
        }
        [HttpPut("return-from-break/{id}")]
        public async Task<IActionResult> ReturnFromBreak(int id)
        {
            var existing = await _representativeService.GetById(id);
            if (existing == null)
            {
                return NotFound("נציג לא נמצא");
            }

            await _representativeService.ReturnFromBreak(id);
            return Ok(new { message = "חזרת מהפסקה, הנך זמין לקבלת שיחות" });
        }
    }
}
