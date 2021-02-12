using Newtonsoft.Json;
using Poker.Library.Models;

namespace Poker.Library.JsonResponses
{
    public class JoinResponse
    {
        [JsonProperty("joined")]
        public bool Joined { get; set; }

        [JsonProperty("party")]
        public Party Party { get; set; }

        [JsonProperty("user")]
        public Player User { get; set; }
    }
}
