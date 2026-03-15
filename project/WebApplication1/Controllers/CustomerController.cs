using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service1.Dto.CustomerDto;
using Service1.Dto.RepresentativeDto;
using Service1.Interface;
using Service1.Services;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // מגן על כל ה-endpoints כברירת מחדל
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        // שליפת כל הלקוחות
        [HttpGet]

        public async Task<ActionResult<IEnumerable<CustomerChatDto>>> GetAll()
        {
            return Ok(await _customerService.GetAll());
        }

        // שליפת לקוח לפי ID
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerChatDto>> GetById(int id)
        {
            var customer = await _customerService.GetById(id);
            if (customer == null)
            {
                return NotFound($"Customer with ID {id} not found.");
            }
            return Ok(customer);
        }
        [HttpGet("updateByID/{id}")]
        public async Task<ActionResult<CustomerChatDto>> GetByIdToUpdeate(int id)
        {
            var customer = await _customerService.GetByIdToUpdate(id);
            if (customer == null)
            {
                return NotFound($"customer with ID {id} not found.");
            }
            return Ok(customer);
        }
        [HttpPost]
        public async Task<ActionResult<CustomerChatDto>> Add([FromBody] CustomerRegisterDto customerRegisterDto)
        {
            if (customerRegisterDto == null)
            {
                return BadRequest();
            }

            var newCustomer = await _customerService.AddCustomer(customerRegisterDto.NameCust, customerRegisterDto.EmailCust, customerRegisterDto.PasswordCust);
            return CreatedAtAction(nameof(GetById), new { id = newCustomer.IDCustomer }, newCustomer);
        }

        // עדכון לקוח קיים
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CustomerRegisterDto customerRegisterDto)
        {
            var existing = await _customerService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _customerService.UpdateCustomer(id, customerRegisterDto.NameCust, customerRegisterDto.EmailCust, customerRegisterDto.PasswordCust);
            return NoContent();
        }

        // מחיקת לקוח
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _customerService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _customerService.DeleteCustomer(id);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<CustomerChatDto>> Login([FromBody] CustomerLoginDto loginDto)
        {
            var customer = await _customerService.Login(loginDto);

            if (customer == null)
            {
                return Unauthorized("אימייל או סיסמה שגויים");
            }

            return Ok(customer);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<CustomerChatDto>> Register([FromBody] CustomerRegisterDto registerDto)
        {
            if (registerDto == null) return BadRequest();

            try
            {
                var result = await _customerService.Register(registerDto);
                return CreatedAtAction(nameof(GetById), new { id = result.IDCustomer }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // יחזיר שגיאה אם האימייל קיים
            }
        }
        [HttpPut("logout/{id}")]
        public async Task<IActionResult> Logout(int id)
        {
            var existing = await _customerService.GetById(id);
            if (existing == null)
            {
                return NotFound("לקוח לא נמצא");
            }

            await _customerService.Logout(id);
            return Ok(new { message = "התנתקת מהמערכת בהצלחה" });
        }
    }
}