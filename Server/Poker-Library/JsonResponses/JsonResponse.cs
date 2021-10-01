using Newtonsoft.Json;

namespace Poker.Library.JsonResponses
{
    public class JsonResponse<T>
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("data")]
        public T Data { get; set; }

        [JsonProperty("error")]
        public string Error { get; set; }

        public JsonResponse() { }

        public JsonResponse(bool success, T data)
        {
            Success = success;
            Data = data;
        }

        public JsonResponse(bool success, T data, string error) : this(success, data)
        {
            Error = error;
        }
    }
}
