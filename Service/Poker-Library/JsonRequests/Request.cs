
using Newtonsoft.Json;

namespace Poker.Library.JsonRequests
{
    public class Request
    {
        [JsonProperty("partyName")]
        public string PartyName { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }
    }
}
