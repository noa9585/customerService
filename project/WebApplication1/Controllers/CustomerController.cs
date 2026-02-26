using Microsoft.AspNetCore.Mvc;
using Service1.Interface;
using Service1.Dto.CustomerDto;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        // שליפת כל הנושאים
        [HttpGet]
        public ActionResult<IEnumerable<CustomerChatDto>> GetAll()
        {
            return Ok(_customerService.GetAll());
        }

        // שליפת נושא לפי ID
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

        // הוספת לקוח חדש
        [HttpPost]
        public ActionResult<CustomerChatDto> Add([FromBody] CustomerRegisterDto customerRegisterDto)
        {
            if (customerRegisterDto == null)
            {
                return BadRequest();
            }

            var newCustomer = _customerService.AddCustomer(customerRegisterDto.NameCust, customerRegisterDto.EmailCust, customerRegisterDto.PasswordCust);
            return CreatedAtAction(nameof(GetById), new { id = newCustomer.IDCustomers }, newCustomer);
        }

        // עדכון נושא קיים
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

        // מחיקת נושא
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
    }
}