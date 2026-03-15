using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Repository.Entities;
using Service1.Dto.ChatMessageDto;
using WebApplication1.Hubs;
using Service1.Interface;
using Service1.Services;
using System.Collections.Generic;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatMessageController : ControllerBase
    {
        private readonly IChatMessageService _chatMessageService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatMessageController(IChatMessageService chatMessageService, IHubContext<ChatHub> hubContext)
        {
            _chatMessageService = chatMessageService;
            _hubContext = hubContext;
        }

        // 1. שליפת כל ההודעות
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetAll()
        {
            return  Ok(await _chatMessageService.GetAll());
        }

        // 2. שליפת הודעה לפי ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ChatMessageChatDto>> GetById(int id)
        {
            var message =await _chatMessageService.GetById(id);
            if (message == null)
            {
                return NotFound($"Message with ID {id} not found.");
            }
            return Ok(message);
        }

        // 3. הוספת הודעה חדשה - שימוש ב-DTO מתוך ה-Body
        [HttpPost]
        public async Task<ActionResult<ChatMessageSendDto>> Add([FromBody] ChatMessageSendDto messageDto)
        {
            if (messageDto == null)
            {
                return BadRequest("Invalid message data.");
            }

            // שליחת הנתונים מה-DTO אל ה-Service
            var createdMessage =await _chatMessageService.AddMessage(
                messageDto.IDSession,
                messageDto.Message,
                messageDto.MessageType
            );

            // החזרת תשובה מסוג 201 Created
            return CreatedAtAction(nameof(GetById), new { id = createdMessage.MessageID }, createdMessage);
        }



        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessageSendDto dto)
        {
            var savedMessage =await _chatMessageService.AddMessage(dto.IDSession,dto.Message,dto.MessageType);

            // שליחת ההודעה בזמן אמת לכל מי שמחובר לשיחה הזו
            await _hubContext.Clients.Group(dto.IDSession.ToString())
                .SendAsync("ReceiveMessage", savedMessage);

            return Ok(savedMessage);
        }

        // 4. עדכון הודעה קיימת
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ChatMessageChatDto messageDto, [FromQuery] bool statusMessage)
        {
            var existing =await _chatMessageService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _chatMessageService.UpdateMessage(
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
        public async Task<IActionResult> Delete(int id)
        {
            var existing =await _chatMessageService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _chatMessageService.DeleteMessage(id);
            return NoContent();
        }
        // שליפת היסטוריית ההודעות לפי ID של שיחה
        [HttpGet("history/{sessionId}")]
        public async Task<IActionResult> GetChatHistory(int sessionId)
        {
            var history =await _chatMessageService.GetChatHistory(sessionId);
            return Ok(history);
        }
    }
}