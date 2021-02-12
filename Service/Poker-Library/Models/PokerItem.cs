using System;
using Newtonsoft.Json;

namespace Poker.Library.Models
{
    public class PokerItem
    {
        [JsonProperty("id")]
        public Guid ID { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("body")]
        public string Body { get; set; }

        [JsonProperty("party")]
        public Party Party { get; set; }

        [JsonProperty("partyName")]
        public string PartyName { get; set; }
    }
}
