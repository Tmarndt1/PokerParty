using System;
using Poker.Library;

namespace Poker_Console
{
    class Program
    {
        static void Main(string[] args)
        {
            WebService.Start();

            Console.WriteLine("WebService started...");

            Console.WriteLine("");

            Console.WriteLine("Type x to close the application");

            while (Console.ReadLine().ToLower() != "x") { }

            Environment.Exit(0);
        }
    }
}
