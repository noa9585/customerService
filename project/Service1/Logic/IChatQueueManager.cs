using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Logic
{
    public interface IChatQueueManager
    {
        void AddToQueue(int sessionId, double score); // הוספת לקוח חדש
        int? GetNextSession();                        // שליפת הלקוח הבא (נציג)
        void RemoveFromQueue(int sessionId);          // הסרת לקוח ספציפי (ביטול/התנתקות)
        List<int> GetAllWaitingIds();                 // קבלת כל ה-IDs שבתור כרגע
        void UpdateScore(int sessionId, double newScore); // עדכון ציון ללקוח קיים
    }
}
