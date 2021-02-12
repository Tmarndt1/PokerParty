using System;
using System.Collections.Generic;
using System.Linq;
using Poker.Library.Models;

namespace Poker.Library
{
    public class DataModel
    {
        public Dictionary<Guid, Party> Parties { get; private set; } = new Dictionary<Guid, Party>();

        public Dictionary<Guid, Player> Players { get; private set; } = new Dictionary<Guid, Player>();

        public static DataModel Instance = new DataModel();

        private DataModel() { }

        public bool TryStart(Party party, Player admin)
        {
            try
            {
                if (party == null || admin == null) return false;

                if (Parties.Any(x => x.Value.Name == party.Name)) return false;

                Parties.Add(party.ID, party);

                Players.Add(admin.ID, admin);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool TryJoin(string password, string partyName, Player player, out Party party)
        {
            party = null;

            try
            {
                if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(password)
                    || player == null) return false;

                party = Parties.FirstOrDefault(x => x.Value.Name == partyName && x.Value.MatchPassword(password)).Value;

                if (party == null) return false;

                if (!Players.TryAdd(player.ID, player))
                {
                    party = null;

                    return false;
                }

                party.Members.Add(player.ID, player);

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
