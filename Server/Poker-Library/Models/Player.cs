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
        [JsonProperty("key")]
        public Guid Key { get; set; }

        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("isAdmin")]
        public bool IsAdmin { get; set; } = false;

        [JsonProperty("voted")]
        public bool Voted { get; set; } = false;

        [JsonProperty("vote")]
        public string Vote { get; set; }

        [JsonProperty("seatNumber")]
        public int SeatNumber { get; set; }

        [JsonProperty("v5Count")]
        public int V5Count
        {
            get
            {
                return Voted ? _v5Count : 0;
            }
            set
            {
                _v5Count = value;
            }
        }

        private int _v5Count = 0;

        [JsonProperty("v10Count")]
        public int V10Count
        {
            get
            {
                return Voted ? _v10Count : 0;
            }
            set
            {
                _v10Count = value;
            }
        }

        private int _v10Count = 0;

        [JsonProperty("v25Count")]
        public int V25Count
        {
            get
            {
                return Voted ? _v25Count : 0;
            }
            set
            {
                _v25Count = value;
            }
        }

        private int _v25Count = 0;

        [JsonProperty("v50Count")]
        public int V50Count
        {
            get
            {
                return Voted ? _v50Count : 0;
            }
            set
            {
                _v50Count = value;
            }
        }

        private int _v50Count = 0;

        [JsonProperty("voteSuit")]
        public CardSuit VoteSuit { get; set; }

        [JsonIgnore]
        public string ConnectionId { get; set; }

        [JsonIgnore]
        public string PartyName { get; set; }

        public Player(string username, string connectionId, bool isAdmin)
        {
            Key = Guid.NewGuid();
            Username = username;
            IsActive = true;
            IsAdmin = isAdmin;
            ConnectionId = connectionId;
            SeatNumber = isAdmin ? 1 : -1;
        }

        public void SetVote(string vote)
        {
            Random random = new Random();
            Voted = true;
            Vote = vote;
            V5Count = random.Next(1, 9);
            V10Count = random.Next(1, 9);
            V25Count = random.Next(1, 7);
            V50Count = random.Next(1, 4);
            VoteSuit = (CardSuit)random.Next(0, 3);
        }
        

        public static Player CreateInactive(int seatNumber)
        {
            return new Player("Player" + seatNumber, null, false)
            {
                Key = Guid.NewGuid(),
                IsActive = false,
                SeatNumber = seatNumber,
                Username = "",
            };
        }

        public void Reset()
        {
            V5Count = 0;
            V10Count = 0;
            V25Count = 0;
            V50Count = 0;
            Voted = false;
        }
    }
}
