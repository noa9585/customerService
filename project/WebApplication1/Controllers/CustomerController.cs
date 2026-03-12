using Microsoft.AspNetCore.Mvc;
using Service1.Interface;
using Service1.Dto.CustomerDto;
using Microsoft.AspNetCore.Authorization;

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

        public ActionResult<IEnumerable<CustomerChatDto>> GetAll()
        {
            return Ok(_customerService.GetAll());
        }

        // שליפת לקוח לפי ID
        [HttpGet("{id}")]
        public ActionResult<CustomerChatDto> GetById(int id)
        {
            var customer = _customerService.GetById(id);
            if (customer == null)
            {
                return NotFound($"Customer with ID {id} not found.");
            }
            return Ok(customer);
        }

        // הוספת לקוח חדש (ישאירו מוגן; אם רוצים לאפשר הרשמה פתוחה השתמשו ב-Register)
        [HttpPost]
        public ActionResult<CustomerChatDto> Add([FromBody] CustomerRegisterDto customerRegisterDto)
        {
            if (customerRegisterDto == null)
            {
                return BadRequest();
            }

            var newCustomer = _customerService.AddCustomer(customerRegisterDto.NameCust, customerRegisterDto.EmailCust, customerRegisterDto.PasswordCust);
            return CreatedAtAction(nameof(GetById), new { id = newCustomer.IDCustomer }, newCustomer);
        }

        // עדכון לקוח קיים
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CustomerRegisterDto customerRegisterDto)
        {
            var existing = _customerService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            _customerService.UpdateCustomer(id, customerRegisterDto.NameCust, customerRegisterDto.EmailCust, customerRegisterDto.PasswordCust);
            return NoContent();
        }

        // מחיקת לקוח
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = _customerService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            _customerService.DeleteCustomer(id);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult<CustomerChatDto> Login([FromBody] CustomerLoginDto loginDto)
        {
            var customer = _customerService.Login(loginDto);

            if (customer == null)
            {
                return Unauthorized("אימייל או סיסמה שגויים");
            }

            return Ok(customer);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public ActionResult<CustomerChatDto> Register([FromBody] CustomerRegisterDto registerDto)
        {
            if (registerDto == null) return BadRequest();

            try
            {
                var result = _customerService.Register(registerDto);
                return CreatedAtAction(nameof(GetById), new { id = result.IDCustomer }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // יחזיר שגיאה אם האימייל קיים
            }
        }
        [HttpPut("logout/{id}")]
        public IActionResult Logout(int id)
        {
            var existing = _customerService.GetById(id);
            if (existing == null)
            {
                return NotFound("לקוח לא נמצא");
            }

            _customerService.Logout(id);
            return Ok(new { message = "התנתקת מהמערכת בהצלחה" });
        }
    }
}