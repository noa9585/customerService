using Repository.Entities;
using Service1.Interface;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Service1.Services
{
    public class AIScoreService : IAIScoreService
    {
        private readonly string _apiKey;
        private readonly HttpClient _httpClient;

        public AIScoreService(IConfiguration config, HttpClient httpClient)
        {
            _apiKey = config["Groq:ApiKey"]
                ?? throw new InvalidOperationException("Groq:ApiKey is missing from appsettings.json");
            _httpClient = httpClient;
        }

        public async Task<int> AnalyzeAndScoreAsync(List<ChatMessage> messages)
        {
            if (messages == null || messages.Count == 0)
                return 5;

            var transcript = BuildTranscript(messages);

            // ── Groq API — תואם לחלוטין ל-OpenAI format ─────────────────────
            var requestBody = new
            {
                model = "llama-3.1-8b-instant",
                max_tokens = 10,
                temperature = 0,
                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content = """
                            אתה מנתח שביעות רצון לקוחות. תקבל תמלול של שיחת שירות לקוחות בעברית.
                            תפקידך: לנתח את שביעות הרצון של הלקוח מהנציג ומהשירות שקיבל.
                            החזר מספר שלם בין 1 ל-10 בלבד, ללא הסברים, ללא טקסט נוסף.
                            1 = שירות גרוע מאוד, 10 = שירות מצוין.
                            בסס את הציון על: יחס הנציג ללקוח, מהירות הטיפול, פתרון הבעיה, טון השיחה.
                            """
                    },
                    new
                    {
                        role = "user",
                        content = $"אתה מערכת דירוג אוטומטית לשיחות שירות לקוחות.\r\n\r\nדרג את איכות השירות של הנציג לפי הקריטריונים:\r\n\r\n1. יחס ללקוח\r\n2. הבנת הבעיה\r\n3. פתרון הבעיה\r\n4. אדיבות \r\n5. מהירות תגובה של הנציג \r\n\r\nהחזר מספר שלם בלבד בין 1 ל10.\r\n\r\nאסור להחזיר טקסט.\r\nאסור להחזיר הסבר.\r\nרק מספר.\r\n:\n\n{transcript}"
                    }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsync(
                "https://api.groq.com/openai/v1/chat/completions", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Groq API error: {response.StatusCode} — {errorBody}");
                return 5;
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            return ParseScore(responseJson);
        }
        // ── Helpers ───────────────────────────────────────────────────────────

        private static string BuildTranscript(List<ChatMessage> messages)
        {
            var sb = new StringBuilder();
            foreach (var msg in messages.OrderBy(m => m.Timestamp))
            {
                var sender = msg.MessageType == SenderType.Customer ? "לקוח" : "נציג";
                var time = msg.Timestamp.ToString("HH:mm");
                sb.AppendLine($"[{time}] {sender}: {msg.Message}");
            }
            return sb.ToString();
        }

        private static int ParseScore(string responseJson)
        {
            try
            {
                // Groq מחזיר בדיוק אותו format כמו OpenAI
                using var doc = JsonDocument.Parse(responseJson);
                var text = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString()
                    ?.Trim();

                Console.WriteLine($"Groq raw response: '{text}'");

                if (int.TryParse(text, out var score))
                    return Math.Clamp(score, 1, 10);

                // אם חזר "7/10" או "ציון: 8"
                var digits = new string(text?.Where(char.IsDigit).ToArray() ?? Array.Empty<char>());
                if (digits.Length > 0 && int.TryParse(digits[..1], out var fallback))
                    return Math.Clamp(fallback, 1, 10);

                return 5;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Groq parse error: {ex.Message}");
                return 5;
            }
        }
    }
}