using Newtonsoft.Json;

namespace Poker.Library.JsonRequests
{
    public class JoinRequest : Request
    {
        [JsonProperty("username")]
        public string Username { get; set; }
    }
}
