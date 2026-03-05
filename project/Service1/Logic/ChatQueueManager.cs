using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Logic
{
    public class ChatQueueManager : IChatQueueManager
    {
        // Dictionary מאפשר לנו גישה מהירה לציון לפי ID
        private readonly Dictionary<int, double> _items = new();

        public void AddToQueue(int sessionId, double score)
        {
            lock (_items) { _items[sessionId] = score; }
        }

        public int? GetNextSession()
        {
            lock (_items)
            {
                if (!_items.Any()) return null;
                // מוצאים את ה-ID עם הציון (Score) הכי גבוה
                var nextId = _items.OrderByDescending(x => x.Value).First().Key;
                _items.Remove(nextId); // מוציאים מהתור לצמיתות
                return nextId;
            }
        }

        public void RemoveFromQueue(int sessionId)
        {
            lock (_items) { _items.Remove(sessionId); }
        }

        public void UpdateScore(int sessionId, double newScore)
        {
            lock (_items) { if (_items.ContainsKey(sessionId)) _items[sessionId] = newScore; }
        }

        public List<int> GetAllWaitingIds()
        {
            lock (_items) { return _items.Keys.ToList(); }
        }
    }
}
