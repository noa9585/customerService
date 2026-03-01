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

        // 3. הוספת הודעה חדשה
        // הערה: מומלץ להשתמש ב-DTO כפרמטר ב-Post במקום רשימת משתנים ארוכה
        [HttpPost]
        public ActionResult<ChatMessageChatDto> Add(int idSession, string message, int idSend, SenderType messageType)
        {
            var newMessage = _chatMessageService.AddMessage(idSession, message, idSend, messageType);

            // מחזיר 201 Created עם נתיב לשליפת האובייקט החדש
            return CreatedAtAction(nameof(GetById), new { id = idSend }, newMessage);
        }

        // 4. עדכון הודעה קיימת
        [HttpPut("{id}")]
        public IActionResult Update(int id, int idSession, string message, int idSend, SenderType messageType, bool statusMessage)
        {
            var existing = _chatMessageService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            _chatMessageService.UpdateMessage(id, idSession, message, idSend, messageType, statusMessage);

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