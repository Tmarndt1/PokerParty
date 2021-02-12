using Newtonsoft.Json;

namespace Poker.Library.JsonRequests
{
    public class StartOrJoinRequest
    {
        [JsonProperty("partyName")]
        public string PartyName { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }

        [JsonProperty("username")]
        public string Username { get; set; }
    }
}
