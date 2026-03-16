using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service1.Dto.TopicDto;
using Service1.Interface;

namespace WebApplication1.Controllers
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
        [Authorize(Roles = "Admin,Representative,Customer")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TopicDto>>> GetAll()
        {
            var topics = await _topicService.GetAll();
            return Ok(topics);
        }

        // שליפת נושא לפי ID
        [Authorize(Roles = "Admin,Representative,Customer")]
        [HttpGet("{id}")]
        public async Task<ActionResult<TopicDto>> GetById(int id)
        {
            var topic = await _topicService.GetById(id);
            if (topic == null)
            {
                return NotFound($"Topic with ID {id} not found.");
            }
            return Ok(topic);
        }

        // הוספת נושא חדש
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<TopicDto>> Add([FromBody] TopicAddDto topicDto)
        {
            if (topicDto == null)
                return BadRequest();
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var newTopic = await _topicService.AddTopic(topicDto.NameTopic, topicDto.AverageTreatTime, topicDto.priorityTopics);
            return CreatedAtAction(nameof(GetById), new { id = newTopic.IDTopic }, newTopic);
        }
        // עדכון נושא קיים
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TopicAddDto topicDto)
        {
            if (topicDto == null) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var existing = await _topicService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _topicService.UpdateTopic(id, topicDto.NameTopic, topicDto.AverageTreatTime, topicDto.priorityTopics);
            return NoContent();
        }

        // מחיקת נושא
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _topicService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }
            await _topicService.DeleteTopic(id);
            return NoContent();
        }
    }
}