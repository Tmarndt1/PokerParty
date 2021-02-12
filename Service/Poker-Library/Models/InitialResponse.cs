namespace Poker.Library.Models
{
    public class InitialResponse
    {
        public bool Success { get; set; }

        public Party Party { get; set; }

        public Player User { get; set; }
    }
}
