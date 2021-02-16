using System;
using Poker.Library.Models;
using Poker.Library.Utilities;

namespace Poker.Library
{
    public class Controller
    {
        public static Controller Instance = new Controller();

        private Controller() { }

        public Result<InitialResponse> TryStart(string connectionId, string username, string password, string partyName)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password)
                || string.IsNullOrWhiteSpace(partyName) || string.IsNullOrWhiteSpace(connectionId))
            {
                return new Result<InitialResponse>(false, "Bad request");
            }

            Player admin = Player.Factory(username, connectionId, true);

            Party party = Party.Start(partyName, password, admin);

            Result result = DataModel.Instance.TryStart(party, admin);

            if (!result.Success)
            {
                return new Result<InitialResponse>(false, result.Error);
            }

            return new Result<InitialResponse>(true, "", new InitialResponse()
            {
                Party = party,
                User = admin
            });
        }

        public Result<InitialResponse> TryJoin(string connectionId, string username, string password, string partyName)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password)
                || string.IsNullOrWhiteSpace(partyName) || string.IsNullOrWhiteSpace(connectionId))
            {
                return new Result<InitialResponse>(false, "Bad request");
            }

            Player player = Player.Factory(username, connectionId);

            Result result = DataModel.Instance.TryJoin(password, partyName, player, out Party party);

            if (!result.Success)
            {
                return new Result<InitialResponse>(false, result.Error);
            }

            return new Result<InitialResponse>(true, "", new InitialResponse()
            {
                Party = party,
                User = player
            });
        }
    }
}
