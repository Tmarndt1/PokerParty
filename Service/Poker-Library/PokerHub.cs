using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Poker.Library.JsonConverters;
using Poker.Library.JsonRequests;
using Poker.Library.JsonResponses;
using Poker.Library.Models;
using Poker.Library.Utilities;

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
            Result<InitialResponse> result = Controller.Instance.TryStart(Context.ConnectionId,
                request.Username, request.Password, request.PartyName);

            if (!result.Success) return new JsonResponse<JObject>(false, null, result.Error);

            StartResponse data = new StartResponse()
            {
                Started = true,
                Party = result.Data.Party,
                User = result.Data.User
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
            Result<InitialResponse> result = Controller.Instance.TryJoin(Context.ConnectionId,
                request.Username, request.Password, request.PartyName);

            if (!result.Success) return new JsonResponse<JObject>(false, null, result.Error);

            JoinResponse data = new JoinResponse()
            {
                Joined = true,
                Party = result.Data.Party,
                User = result.Data.User
            };

            return new JsonResponse<JObject>()
            {
                Success = true,
                Data = JObject.FromObject(data, _serializer)
            };
        }
    }
}
