using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Poker.Library.Utilities;

namespace Poker.Library.Models
{
    public class Party
    {
        [JsonProperty("id")]
        public Guid ID { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("pokerItem")]
        public PokerItem PokerItem { get; set; }

        [JsonProperty("members")]
        public Dictionary<Guid, Player> Members { get; set; } = new Dictionary<Guid, Player>();

        [JsonProperty("voting")]
        public bool Voting { get; set; }

        [JsonIgnore]
        public Player Admin { get; set; }

        [JsonIgnore]
        private string _hashedPass;

        public static Party Start(string name, string password, Player admin)
        {
            Party party = new Party()
            {
                ID = Guid.NewGuid(),
                Name = name,
                Voting = false,
                Admin = admin,
                _hashedPass = Crypto.Hash(password)
            };

            admin.SeatNumber = 1;

            party.Members.Add(admin.ID, admin);

            for (int i = 2; i < 9; i++)
            {
                Player player = Player.CreateInactive(i);

                party.Members.Add(player.ID, player);
            }


            return party;
        }

        public bool TryJoin(Player player)
        {
            if (!Members.TryAdd(player.ID, player)) return false;

            int maxSeatNumber = Members.Max(x => x.Value.SeatNumber);

            if (maxSeatNumber >= 8) return false;

            player.SeatNumber = maxSeatNumber;

            return true;
        }

        public void TryAddItem(PokerItem item)
        {
            PokerItem = item;
        }

        public bool MatchPassword(string password) => Crypto.Hash(password) == _hashedPass;
    }
}
