using System;
using Poker.Library.Models;

namespace Poker.Library
{
    public class Controller
    {
        public static Controller Instance = new Controller();

        private Controller() { }

        public InitialResponse TryStart(string connectionId, string username, string password, string partyName)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password)
                || string.IsNullOrWhiteSpace(partyName) || string.IsNullOrWhiteSpace(connectionId))
            {
                return new InitialResponse()
                {
                    Success = false
                };
            }

            Player admin = Player.Factory(username, connectionId, true);

            Party party = Party.Start(partyName, password, admin);

            if (!DataModel.Instance.TryStart(party, admin))
            {
                return new InitialResponse()
                {
                    Success = false
                };
            }

            return new InitialResponse()
            {
                Success = true,
                Party = party,
                User = admin
            };
        }

        public InitialResponse TryJoin(string connectionId, string username, string password, string partyName)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password)
                || string.IsNullOrWhiteSpace(partyName) || string.IsNullOrWhiteSpace(connectionId))
            {
                return new InitialResponse()
                {
                    Success = false
                };
            }

            Player player = Player.Factory(username, connectionId);

            if (!DataModel.Instance.TryJoin(password, partyName, player, out Party party))
            {
                return new InitialResponse()
                {
                    Success = false
                };
            }

            return new InitialResponse()
            {
                Success = true,
                Party = party,
                User = player
            };
        }
    }
}
