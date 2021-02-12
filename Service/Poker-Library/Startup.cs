using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace Poker.Library
{
    public class Startup
    {
        private string _corsPolicy = "policy";

        [Obsolete]
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<PokerHub>("/signalR");
            });

            app.UseCors(_corsPolicy);
        }

        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(options => options.AddPolicy(_corsPolicy, builder =>
            {
                builder
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin()
                    .WithOrigins("*");
            }));

            services.AddSignalR()
                .AddNewtonsoftJsonProtocol();
        }
    }

}