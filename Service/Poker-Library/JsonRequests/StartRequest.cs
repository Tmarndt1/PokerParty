using Newtonsoft.Json;

namespace Poker.Library.JsonRequests
{
    public class StartRequest : Request
    {
        [JsonProperty("username")]
        public string Username { get; set; }
    }
}
