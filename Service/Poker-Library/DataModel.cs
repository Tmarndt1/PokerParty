using System;
using System.Collections.Generic;
using System.Linq;
using Poker.Library.Models;
using Poker.Library.Utilities;

namespace Poker.Library
{
    public class DataModel
    {
        public Dictionary<Guid, Party> Parties { get; private set; } = new Dictionary<Guid, Party>();

        public Dictionary<Guid, Player> Players { get; private set; } = new Dictionary<Guid, Player>();

        public static DataModel Instance = new DataModel();

        private DataModel() { }

        public Result TryStart(Party party, Player admin)
        {
            try
            {
                if (party == null || admin == null)
                {
                    return new Result(false, "Bad request");
                }

                if (Parties.Any(x => x.Value.Name == party.Name))
                {
                    return new Result(false, "Party name already exists");
                }

                Parties.Add(party.ID, party);

                Players.Add(admin.ID, admin);

                return new Result(true);
            }
            catch
            {
                return new Result(false, "Bad request");
            }
        }

        public Result TryJoin(string password, string partyName, Player player, out Party party)
        {
            party = null;

            Result badRequest = new Result(false, "Bad request");

            try
            {
                if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(password)
                    || player == null) return new Result(false, "Bad request"); ;

                party = Parties.FirstOrDefault(x => x.Value.Name == partyName).Value;

                if (party == null) return badRequest;

                if (!party.MatchPassword(password)) return new Result(false, "Invalid password");

                if (!Players.TryAdd(player.ID, player))
                {
                    party = null;

                    return badRequest;
                }

                return party.TryJoin(player);
            }
            catch
            {
                return badRequest;
            }
        }
    }
}
