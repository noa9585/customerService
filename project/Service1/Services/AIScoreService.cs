using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using Repository.Entities;
using Service1.Interface;
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
            // שים לב לעדכן את השם ב-appsettings.json ל-GeminiApiKey או לשנות כאן
            _apiKey = config["GeminiApiKey"]
                ?? throw new InvalidOperationException("GeminiApiKey is missing from appsettings.json");
            _httpClient = httpClient;
        }

        public async Task<int> AnalyzeAndScoreAsync(List<ChatMessage> messages)
        {
            if (messages == null || messages.Count == 0)
                return 5;
            var transcript = BuildTranscript(messages);

            // ── Gemini API Configuration ─────────────────────────────────────
            var apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key={_apiKey}";
            var requestBody = new
            {
                contents = new[]
    {
        new
        {
            parts = new[]
            {
                new { text = $@"אתה מנתח שביעות רצון לקוחות. תקבל תמלול של שיחת שירות לקוחות בעברית.
                    תפקידך: לנתח את שביעות הרצון של הלקוח מהנציג ומהשירות שקיבל.
                    החזר מספר שלם בין 1 ל-10 בלבד, ללא הסברים, ללא טקסט נוסף.
                    1 = שירות גרוע מאוד, 10 = שירות מצוין.
                    בסס את הציון על: יחס הנציג ללקוח, מהירות הטיפול, פתרון הבעיה, טון השיחה.
                    
                    התמלול:
                    {transcript}"
                }
            }
        }
    },
                generationConfig = new
                {
                    temperature = 0.1
                    // הסרנו את responseMimeType כדי למנוע שגיאות תאימות
                }
            };
            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(apiUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Gemini API error: {response.StatusCode} — {errorBody}");
                    return 5;
                }

                var responseJson = await response.Content.ReadAsStringAsync();
                return ParseGeminiScore(responseJson);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return 7; // ערך ברירת מחדל במקרה שגיאה כפי שהגדרת
            }
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

        private static int ParseGeminiScore(string responseJson)
        {
            try
            {
                using var doc = JsonDocument.Parse(responseJson);
                // חילוץ הטקסט לפי המבנה של Gemini
                var text = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString()
                    ?.Trim();

                Console.WriteLine($"Gemini raw response: '{text}'");

                if (int.TryParse(text, out var score))
                    return Math.Clamp(score, 1, 10);

                // ניסיון חילוץ ספרה ראשונה במידה והמודל התחכם
                var digits = new string(text?.Where(char.IsDigit).ToArray() ?? Array.Empty<char>());
                if (digits.Length > 0 && int.TryParse(digits[..1], out var fallback))
                    return Math.Clamp(fallback, 1, 10);

                return 5;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Gemini parse error: {ex.Message}");
                return 5;
            }
        }
    }
}