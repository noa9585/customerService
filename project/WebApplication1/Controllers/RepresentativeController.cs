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
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RepresentativeChatDto>>> GetAll()
        {
            return Ok(await _representativeService.GetAll());
        }

        // שליפת נציג לפי ID
        [Authorize(Roles = "Admin,Representative,Customer")]
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

        [Authorize(Roles = "Representative")]
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
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<RepresentativeDto>> Add([FromBody] RepresentativeRegisterDto representativeDto)
        {
            if (representativeDto == null)
                return BadRequest();
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var newrepresentative = await _representativeService.AddRepresentative(representativeDto.NameRepr, representativeDto.EmailRepr, representativeDto.PasswordRepr);
            return CreatedAtAction(nameof(GetById), new { id = newrepresentative.IDRepresentative }, newrepresentative);
        }
        // עדכון נציג קיים
        [Authorize(Roles = "Representative")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RepresentativeRegisterDto representativeDto)
        {
            if (representativeDto == null) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var existing = await _representativeService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _representativeService.UpdateRepresentative(id, representativeDto.NameRepr, representativeDto.EmailRepr, representativeDto.PasswordRepr);
            return NoContent();
        }

        // מחיקת נציג
        [Authorize(Roles = "Admin")]
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
            try
            {
                var result = await _representativeService.Login(loginDto);
                if (result == null) return Unauthorized("אימייל או סיסמה שגויים");
                return Ok(result);
            }
            catch (InvalidOperationException ex) when (ex.Message == "WAITING")
            {
                return StatusCode(403, new
                {
                    code = "WAITING",
                    message = "בקשת ההצטרפות שלך ממתינה לאישור מנהל. נודיע לך בהקדם."
                });
            }
            catch (InvalidOperationException ex) when (ex.Message == "DENIED")
            {
                return StatusCode(403, new
                {
                    code = "DENIED",
                    message = "בקשת ההצטרפות שלך נדחתה. אנא פנה למנהל המערכת."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<RepresentativeDto>> Register([FromBody] RepresentativeRegisterDto regDto)
        {
            if (regDto == null) return BadRequest("נתונים חסרים");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
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
        [Authorize(Roles = "Admin,Representative")]
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


        //  יציאה להפסקה
        [Authorize(Roles = "Representative")]
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
        // חזרה מהפסקה
        [Authorize(Roles = "Representative")]
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

        [Authorize(Roles = "Admin")]
        [HttpGet("waiting")]
        public async Task<ActionResult<IEnumerable<RepresentativeChatDto>>> GetWaiting()
        {
            return Ok(await _representativeService.GetAllPending());
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            try
            {
                await _representativeService.ApproveRepresentative(id);
                return Ok(new { message = "הנציג אושר בהצלחה" });
            }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("deny/{id}")]
        public async Task<IActionResult> Deny(int id)
        {
            try
            {
                await _representativeService.DenyRepresentative(id);
                return Ok(new { message = "הנציג נדחה" });
            }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }
    }
}
