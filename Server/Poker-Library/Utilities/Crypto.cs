using System.Security.Cryptography;
using System.Text;

namespace Poker.Library.Utilities
{
    public class Crypto
    {
        public static byte[] Hash(string inputString)
        {
            using (HashAlgorithm algorithm = SHA256.Create())
            {
                return algorithm.ComputeHash(Encoding.UTF8.GetBytes(inputString));
            }
        }
    }
}
