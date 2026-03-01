using Microsoft.AspNetCore.Mvc;
using Service1.Interface;
using Service1.Dto.ChatMessageDto;
using Repository.Entities;
using System.Collections.Generic;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatMessageController : ControllerBase
    {
        private readonly IChatMessageService _chatMessageService;

        public ChatMessageController(IChatMessageService chatMessageService)
        {
            _chatMessageService = chatMessageService;
        }

        // 1. שליפת כל ההודעות
        [HttpGet]
        public ActionResult<IEnumerable<ChatMessageChatDto>> GetAll()
        {
            return Ok(_chatMessageService.GetAll());
        }

        // 2. שליפת הודעה לפי ID
        [HttpGet("{id}")]
        public ActionResult<ChatMessageChatDto> GetById(int id)
        {
            var message = _chatMessageService.GetById(id);
            if (message == null)
            {
                return NotFound($"Message with ID {id} not found.");
            }
            return Ok(message);
        }

        // 3. הוספת הודעה חדשה - שימוש ב-DTO מתוך ה-Body
        [HttpPost]
        public ActionResult<ChatMessageSendDto> Add([FromBody] ChatMessageSendDto messageDto)
        {
            if (messageDto == null)
            {
                return BadRequest("Invalid message data.");
            }

            // שליחת הנתונים מה-DTO אל ה-Service
            var createdMessage = _chatMessageService.AddMessage(
                messageDto.IDSession,
                messageDto.Message,
                messageDto.MessageType
            );

            // החזרת תשובה מסוג 201 Created
            return CreatedAtAction(nameof(GetById), new { id = createdMessage.MessageID }, createdMessage);
        }

        // 4. עדכון הודעה קיימת
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ChatMessageChatDto messageDto, [FromQuery] bool statusMessage)
        {
            var existing = _chatMessageService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            _chatMessageService.UpdateMessage(
                id,
                messageDto.IDSession,
                messageDto.Message,
                messageDto.MessageType,
                statusMessage
            );

            return NoContent();
        }

        // 5. מחיקת הודעה
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = _chatMessageService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            _chatMessageService.DeleteMessage(id);
            return NoContent();
        }
    }
}