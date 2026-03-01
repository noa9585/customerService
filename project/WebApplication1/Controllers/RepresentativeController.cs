using Microsoft.AspNetCore.Mvc;
using Service1.Interface;
using Service1.Dto.RepresentativeDto;
namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepresentativeController:ControllerBase
    {
        private readonly IRepresentativeService _representativeService;

        public RepresentativeController(IRepresentativeService representativeService)
        {
            _representativeService = representativeService;
        }
        // שליפת כל הנציגים
        [HttpGet]
        public ActionResult<IEnumerable<RepresentativeChatDto>> GetAll()
        {
            return Ok(_representativeService.GetAll());
        }
        // שליפת נציג לפי ID
        [HttpGet("{id}")]
        public ActionResult<RepresentativeChatDto> GetById(int id)
        {
            var representative = _representativeService.GetById(id);
            if (representative == null)
            {
                return NotFound($"Representative with ID {id} not found.");
            }
            return Ok(representative);
        }
        // הוספת נציג חדש
        [HttpPost]
        public ActionResult<RepresentativeDto> Add([FromBody] RepresentativeRegisterDto representativeDto)
        {
            if (representativeDto == null)
            {
                return BadRequest();
            }

            var newrepresentative= _representativeService.AddRepresentative(representativeDto.NameRepr,representativeDto.EmailRepr, representativeDto.PasswordRepr);
            return CreatedAtAction(nameof(GetById), new { id = newrepresentative.IDRepresentative }, newrepresentative);
        }
        // עדכון נציג קיים
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] RepresentativeRegisterDto representativeDto)
        {
            var existing = _representativeService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            _representativeService.UpdateRepresentative(id,representativeDto.NameRepr,representativeDto.EmailRepr,representativeDto.PasswordRepr );
            return NoContent();
        }

        // מחיקת נציג
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = _representativeService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            _representativeService.DeleteRepresentative(id);
            return NoContent();
        }
    }
}




        

       

      
    

    
