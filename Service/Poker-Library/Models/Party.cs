using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;
using Poker.Library.Utilities;

namespace Poker.Library.Models
{
    public class Party
    {
        [JsonProperty("key")]
        public Guid Key { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("workItem")]
        public WorkItem WorkItem { get; set; } = new WorkItem();

        [JsonProperty("members")]
        public List<Player> Members { get; set; } = new List<Player>();

        [JsonProperty("voting")]
        public bool Voting { get; set; } = false;

        [JsonProperty("flipped")]
        public bool Flipped { get; set; } = false;

        [JsonIgnore]
        public Player Admin { get; set; }

        public event EventHandler<Party> OnUpdated;

        [JsonIgnore]
        private byte[] _hashedPass;

        [JsonIgnore]
        private List<int> _availableSeats = new List<int>() { 2, 3, 4, 5, 6, 7, 8, 9, 10 };

        [JsonIgnore]
        private List<WorkItem> _workItems = new List<WorkItem>();

        private object _lock = new object();

        public Party(string name, string password, Player admin)
        {
            Key = Guid.NewGuid();
            Name = name;
            Voting = false;
            Admin = admin;

            HashAlgorithm sha = SHA256.Create();

            byte[] buffer = Encoding.ASCII.GetBytes(password);

            _hashedPass = sha.ComputeHash(buffer);

            admin.SeatNumber = 1;

            Members.Add(admin);

            for (int i = 2; i < 11; i++)
            {
                Members.Add(Player.CreateInactive(i));
            }
        }

        public Result TryJoin(string password, Player player)
        {
            lock (_lock)
            {
                if (!MatchPassword(password)) return new Result(false, "Password invalid");

                if (Members.Count(x => x.IsActive) >= 10)
                    return new Result(false, "Party cannot have more thsan 10 members");

                player.SeatNumber = GetRandomSeat();

                if (Members.Any(x => x.SeatNumber == player.SeatNumber && !x.IsActive))
                {
                    Player member = Members.First(x => x.SeatNumber == player.SeatNumber && !x.IsActive);

                    Members.Remove(member);
                }

                player.PartyName = Name;

                Members.Add(player);

                OnUpdated.Invoke(this, this);

                return new Result(true);
            }
        }

        public Result TryAddWorkItem(string password, WorkItem item)
        {
            lock (_lock)
            {
                if (!MatchPassword(password)) return new Result(false, "Password invalid");

                WorkItem = item;

                _workItems.Add(item);

                foreach (var player in Members)
                {
                    player.Reset();
                }

                Voting = true;

                OnUpdated.Invoke(this, this);

                return new Result(true);
            }
        }

        public Result TryVote(string password, Guid playerKey, string vote)
        {
            lock (_lock)
            {
                if (!MatchPassword(password)) return new Result(false, "Password invalid");

                Player player = Members.FirstOrDefault(x => x.Key == playerKey);

                if (player == null) return new Result(false, "Could not find the correct player");

                player.SetVote(vote);

                OnUpdated.Invoke(this, this);

                return new Result(true);
            }
        }

        public Result TryFlip(string password)
        {
            lock (_lock)
            {
                if (!MatchPassword(password)) return new Result(false, "Password invalid");

                Flipped = !Flipped;

                OnUpdated.Invoke(this, this);

                return new Result(true);
            }
        }

        private bool MatchPassword(string password)
        {
            byte[] hash1 = SHA256.Create().ComputeHash(Encoding.ASCII.GetBytes(password));

            byte[] hash2 = _hashedPass;

            return Encoding.ASCII.GetString(hash1) == Encoding.ASCII.GetString(hash2);
        }

        private int GetRandomSeat()
        {
            Random random = new Random();

            int index = random.Next(0, _availableSeats.Count);

            int seatNumber = _availableSeats[index];

            _availableSeats.Remove(seatNumber);

            return seatNumber;
        }
    }
}
