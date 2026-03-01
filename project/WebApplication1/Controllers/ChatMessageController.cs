using Microsoft.AspNetCore.Mvc;
using Service1.Interface;
using Service1.Dto.ChatMessageDto;
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

        // שליפת כל ההודעות
        [HttpGet]
        public ActionResult<IEnumerable<ChatMessageChatDto>> GetAll()
        {
            return Ok(_chatMessageService.GetAll());
        }

        // שליפת הודעה לפי ID
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

        // הוספת הודעה חדשה - מסונכרן בדיוק לחתימת הממשק
        [HttpPost]
        public ActionResult<ChatMessageChatDto> Add(string message, int idSend, string messageType, int idRepresentative, int idCustomer)
        {
            // קריאה לשירות עם הפרמטרים המפורטים
            var newMessage = _chatMessageService.AddMessage(message, idSend, messageType, idRepresentative, idCustomer);

            // שימוש במזהה השולח כאינדקס זמני (או מזהה ההודעה אם קיים ב-DTO)
            return CreatedAtAction(nameof(GetById), new { id = idSend }, newMessage);
        }

        // עדכון הודעה קיימת - מסונכרן בדיוק לחתימת הממשק
        [HttpPut("{id}")]
        public IActionResult Update(int id, string message, int idSend, string messageType, int idRepresentative, int idCustomer, bool statusMessage)
        {
            var existing = _chatMessageService.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            // עדכון כל השדות כפי שמופיע במימוש השירות
            _chatMessageService.UpdateMessage(id, message, idSend, messageType, idRepresentative, idCustomer, statusMessage);

            return NoContent();
        }

        // מחיקת הודעה
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