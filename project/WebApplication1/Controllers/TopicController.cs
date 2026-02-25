using Microsoft.AspNetCore.Mvc;
using Service1.Interface;
using Service1.Dto.TopicDto;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopicController : ControllerBase
    {
        private readonly ITopicService _topicService;

        public TopicController(ITopicService topicService)
        {
            _topicService = topicService;
        }

        // שליפת כל הנושאים
        [HttpGet]
        public ActionResult<IEnumerable<TopicDto>> GetAll()
        {
            return Ok(_topicService.GetAll());
        }

        // שליפת נושא לפי ID
        [HttpGet("{id}")]
        public ActionResult<TopicDto> GetById(int id)
        {
            var topic = _topicService.GetById(id);
            if (topic == null)
            {
                return NotFound($"Topic with ID {id} not found.");
            }
            return Ok(topic);
        }

        // הוספת נושא חדש
        [HttpPost]
        public ActionResult<TopicDto> Add([FromBody] TopicAddDto topicDto)
        {
            if (topicDto == null)
            {
                return BadRequest();
            }

            var newTopic = _topicService.AddTopic(topicDto.NameTopic, topicDto.AverageTreatTime, topicDto.priorityTopics);
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
            var existing = _topicService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            _topicService.DeleteTopic(id);
            return NoContent();
        }
    }
}