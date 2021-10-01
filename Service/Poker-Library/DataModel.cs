using System;
using System.Collections.Concurrent;
using System.Linq;
using Poker.Library.JsonRequests;
using Poker.Library.JsonResponses;
using Poker.Library.Models;
using Poker.Library.Utilities;

namespace Poker.Library
{
    public class DataModel
    {
        public static DataModel Instance = new DataModel();

        private ConcurrentDictionary<Guid, Party> _parties = new ConcurrentDictionary<Guid, Party>();

        private ConcurrentDictionary<Guid, Player> _players = new ConcurrentDictionary<Guid, Player>();

        private DataModel() { }

        private object _lock = new object();

        public string GetUsersParty(string connectionId)
        {
            lock (_lock)
            {
                if (!_players.Any(x => x.Value.ConnectionId == connectionId)) return null;

                Player player = _players.FirstOrDefault(x => x.Value.ConnectionId == connectionId).Value;

                return player.PartyName;
            }
        }

        public bool TryStart(StartRequest request, string connectionId, out Result<StartResponse> result)
        {
            result = new Result<StartResponse>(null, false);

            try
            {
                if (request == null) return false;

                if (string.IsNullOrEmpty(request.Username)) return false;

                if (string.IsNullOrEmpty(request.Password)) return false;

                if (string.IsNullOrEmpty(request.PartyName)) return false;

                if (_parties.Any(x => x.Value.Name == request.PartyName))
                {
                    result = new Result<StartResponse>(null, false, "Party name already exists");

                    return false;
                }

                Player admin = new Player(request.Username, connectionId, true);

                Party party = new Party(request.PartyName, request.Password, admin);

                _parties.TryAdd(party.Key, party);

                _players.TryAdd(admin.Key, admin);

                result = new Result<StartResponse>(new StartResponse()
                {
                    Started = true,
                    Party = party,
                    User = admin
                });

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool TryJoin(JoinRequest request, string connectionId, out Result<JoinResponse> result)
        {
            result = new Result<JoinResponse>(null, false);

            try
            {
                if (request == null) return false;

                if (string.IsNullOrEmpty(request.Username)) return false;

                if (string.IsNullOrEmpty(request.Password)) return false;

                if (string.IsNullOrEmpty(request.PartyName)) return false;

                if (TryValidate(request.PartyName, out Result<Party> validateResult))
                {
                    Party party = validateResult.Data;

                    Player player = new Player(request.Username, connectionId, false);

                    if (!party.TryJoin(request.Password, player).Success)
                    {
                        return false;
                    }

                    if (!_players.TryAdd(player.Key, player))
                    {
                        return false;
                    }

                    result = new Result<JoinResponse>(new JoinResponse()
                    {
                        User = player,
                        Party = party,
                        Joined = true
                    });

                    return true;
                }
           
                return false;
            }
            catch
            {
                return false;
            }
        }

        public bool TrySubmitWorkItem(WorkItemRequest request, out Result<Party> result)
        {
            result = new Result<Party>(null, false, "Invalid request");

            if (request == null) return false;

            if (TryValidate(request.PartyName, out Result<Party> validateResult))
            {
                Party party = validateResult.Data;

                Result addResult = party.TryAddWorkItem(request.Password, request.WorkItem);

                if (!addResult.Success) return false;

                result = new Result<Party>(party, true);

                return true;
            }

            return false;
        }

        public bool TrySubmitVote(VoteRequest request, out Result<Party> result)
        {
            result = new Result<Party>(null, false, "Invalid request");

            if (request == null) return false;

            if (TryValidate(request.PartyName, out Result<Party> validateResult))
            {
                Party party = validateResult.Data;

                Result addResult = party.TryVote(request.Password, request.PlayerKey, request.Vote);

                if (!addResult.Success) return false;

                result = new Result<Party>(party, true);

                return true;
            }

            return false;
        }

        public bool TryFlip(Request request, out Result<Party> result)
        {
            result = new Result<Party>(null, false, "Invalid request");

            if (request == null) return false;

            if (TryValidate(request.PartyName, out Result<Party> validateResult))
            {
                Party party = validateResult.Data;

                Result flipResult = party.TryFlip(request.Password);

                if (!flipResult.Success) return false;

                result = new Result<Party>(party, true);

                return true;
            }

            return false;
        }

        private bool TryValidate(string partyName, out Result<Party> result)
        {
            result = new Result<Party>(null, false, "Invalid request");

            Party party = _parties.FirstOrDefault(x => x.Value.Name == partyName).Value;

            if (party == null) return false;

            result = new Result<Party>(party, true);

            return true;
        }

    }
}
