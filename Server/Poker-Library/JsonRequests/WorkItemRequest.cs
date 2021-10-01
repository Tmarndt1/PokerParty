using Newtonsoft.Json;
using Poker.Library.Models;

namespace Poker.Library.JsonRequests
{
    public class WorkItemRequest
    {
        [JsonProperty("partyName")]
        public string PartyName { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }

        [JsonProperty("workItem")]
        public WorkItem WorkItem { get; set; }
    }
}
