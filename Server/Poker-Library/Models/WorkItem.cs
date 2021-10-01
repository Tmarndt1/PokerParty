using System;
using Newtonsoft.Json;

namespace Poker.Library.Models
{
    public class WorkItem
    {
        [JsonProperty("key")]
        public Guid Key { get; set; } = Guid.NewGuid();

        [JsonProperty("title")]
        public string Title { get; set; } = "";

        [JsonProperty("body")]
        public string Body { get; set; } = "";

        [JsonProperty("active")]
        public bool Active { get; set; } = false;
    }
}
