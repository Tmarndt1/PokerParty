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
        public List<Player> Members { get; set; } = new List<Player>();

        [JsonProperty("voting")]
        public bool Voting { get; set; }

        [JsonIgnore]
        public Player Admin { get; set; }

        [JsonIgnore]
        private byte[] _hashedPass;

        [JsonIgnore]
        private List<int> _availableSeats = new List<int>() { 2, 3, 4, 5, 6, 7, 8, 9, 10 };

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

            party.Members.Add(admin);

            for (int i = 2; i < 11; i++)
            {
                party.Members.Add(Player.CreateInactive(i));
            }

            return party;
        }

        public Result TryJoin(Player player)
        {
            if (Members.Count(x => x.IsActive) >= 10)
                return new Result(false, "Party cannot have more thsan 10 members");

            player.SeatNumber = GetRandomSeat();

            if (Members.Any(x => x.SeatNumber == player.SeatNumber && !x.IsActive))
            {
                Player member = Members.First(x => x.SeatNumber == player.SeatNumber && !x.IsActive);

                Members.Remove(member);
            }

            Members.Add(player);

            return new Result(true);
        }

        public void TryAddItem(PokerItem item)
        {
            PokerItem = item;
        }

        public bool MatchPassword(string password) => Crypto.Hash(password).ToString() == _hashedPass.ToString();

        public int GetRandomSeat()
        {
            Random random = new Random();

            int index = random.Next(0, _availableSeats.Count);

            int seatNumber = _availableSeats[index];

            _availableSeats.Remove(seatNumber);

            return seatNumber;
        }
    }
}
