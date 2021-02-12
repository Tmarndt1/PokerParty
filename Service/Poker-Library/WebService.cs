using System;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Poker.Library
{
    public static class WebService
    {
        private static X509Certificate2 _cert;

        public static void Start()
        {
            Task.Run(() =>
            {
                CreateWebHostBuilder(new string[0]).Build().Run();
            });
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .UseKestrel()
            .UseIISIntegration()
            .UseStartup<Startup>()
            .ConfigureKestrel((context, options) =>
            {
                options.Listen(IPAddress.Any, 65000, listenOptions =>
                {
                    //if (_cert != null) listenOptions.UseHttps(_cert);
                });
            });
        
    }
}
