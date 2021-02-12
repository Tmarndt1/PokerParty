using System;
using Newtonsoft.Json;

namespace Poker.Library.Models
{
    public enum CardSuit
    {
        Clubs = 0,
        Diamonds = 1,
        Hearts = 2,
        Spades = 3,
    }

    public class Player
    {
        [JsonProperty("id")]
        public Guid ID { get; set; }

        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("active")]
        public bool Active { get; set; }

        [JsonProperty("vote")]
        public string Vote { get; set; }

        [JsonProperty("isAdmin")]
        public bool IsAdmin { get; set; } = false;

        [JsonProperty("voted")]
        public bool Voted { get; set; } = false;

        [JsonProperty("seatNumber")]
        public int SeatNumber { get; set; }

        [JsonProperty("v5Count")]
        public int? V5Count { get; set; }

        [JsonProperty("v10Count")]
        public int? V10Count { get; set; }

        [JsonProperty("v25Count")]
        public int? V25Count { get; set; }

        [JsonProperty("v50Count")]
        public int? V50Count { get; set; }

        [JsonProperty("voteSuit")]
        public CardSuit VoteSuit { get; set; }

        [JsonIgnore]
        public string ConnectionId { get; set; }

        public static Player Factory(string username, string connectionId)
        {
            return Factory(username, connectionId, false);
        }

        public static Player Factory(string username, string connectionId, bool isAdmin)
        {
            return new Player()
            {
                ID = Guid.NewGuid(),
                Username = username,
                Active = true,
                IsAdmin = isAdmin,
                ConnectionId = connectionId
            };
        }

        public static Player CreateInactive(int seatNumber)
        {
            return new Player()
            {
                ID = Guid.NewGuid(),
                Active = false,
                SeatNumber = seatNumber,
                Username = "",
            };
        }
    }
}
