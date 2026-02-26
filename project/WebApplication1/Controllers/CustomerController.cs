using Microsoft.AspNetCore.Mvc;
using Service1.Interface;
using Service1.Dto.CustomerDto;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _topicService;

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
        public ActionResult<TopicDto> GetById(int id)
        {
            var customer = _customerService.GetById(id);
            if (customer == null)
            {
                return NotFound($"Topic with ID {id} not found.");
            }
            return Ok(customer);
        }

        // הוספת נושא חדש
        [HttpPost]
        public ActionResult<CustomerChatDto> Add([FromBody] CustomerChatDto customerChatDto)
        {
            if (customerChatDto == null)
            {
                return BadRequest();
            }

            var newCustomer = _cu.AddTopic(topicDto.NameTopic, topicDto.AverageTreatTime, topicDto.priorityTopics);
            return CreatedAtAction(nameof(GetById), new { id = newTopic.IDTopics }, newTopic);
        }

        // עדכון נושא קיים
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] TopicAddDto topicDto)
        {
            var existing = _topicService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            _topicService.UpdateTopic(id, topicDto.NameTopic, topicDto.AverageTreatTime, topicDto.priorityTopics);
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

            _customerService.(id);
            return NoContent();
        }
    }
}