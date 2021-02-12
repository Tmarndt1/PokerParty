using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Poker.Library.JsonConverters;
using Poker.Library.JsonRequests;
using Poker.Library.JsonResponses;
using Poker.Library.Models;

namespace Poker.Library
{
    public class PokerHub : Hub
    {
        static JsonSerializer _serializer = new JsonSerializer();

        static PokerHub()
        {
            _serializer.Converters.Add(new PartyConverter());
        }

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "SignalR Users");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalR Users");

            await base.OnDisconnectedAsync(exception);
        }

        [HubMethodName("Start")]
        public JsonResponse<JObject> Start(StartOrJoinRequest request)
        {
            InitialResponse response = Controller.Instance.TryStart(Context.ConnectionId,
                request.Username, request.Password, request.PartyName);

            if (!response.Success) return new JsonResponse<JObject>(false, null, "Failed to start the poker party");

            StartResponse data = new StartResponse()
            {
                Started = true,
                Party = response.Party,
                User = response.User
            };

            return new JsonResponse<JObject>()
            {
                Success = true,
                Data = JObject.FromObject(data, _serializer)
            };
        }

        [HubMethodName("Join")]
        public JsonResponse<JObject> Join(StartOrJoinRequest request)
        {
            InitialResponse response = Controller.Instance.TryJoin(Context.ConnectionId,
                request.Username, request.Password, request.PartyName);

            if (!response.Success) return new JsonResponse<JObject>(false, null, "Failed to join the poker party");

            JoinResponse data = new JoinResponse()
            {
                Joined = true,
                Party = response.Party,
                User = response.User
            };

            return new JsonResponse<JObject>()
            {
                Success = true,
                Data = JObject.FromObject(data, _serializer)
            };
        }
    }
}
