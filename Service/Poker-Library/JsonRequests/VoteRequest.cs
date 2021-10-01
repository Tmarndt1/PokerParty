using System;
using Newtonsoft.Json;

namespace Poker.Library.JsonRequests
{
    public class VoteRequest : Request
    {
        [JsonProperty("vote")]
        public string Vote { get; set; }

        [JsonProperty("playerKey")]
        public Guid PlayerKey { get; set; }
    }
}
