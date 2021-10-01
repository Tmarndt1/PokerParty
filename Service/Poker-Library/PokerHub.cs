using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using Poker.Library.JsonRequests;
using Poker.Library.JsonResponses;
using Poker.Library.Models;
using Poker.Library.Utilities;

namespace Poker.Library
{
    public enum BroadcastOption
    {
        PartyUpdate
    }

    public class PokerHub : Hub
    {
        private static DataModel _dataModel = DataModel.Instance;

        private IHubContext<PokerHub> _context;

        public PokerHub(IHubContext<PokerHub> hubContext) : base()
        {
            _context = hubContext;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public async Task BroadcastAsync(BroadcastOption option, string partyName, object data)
        {
            try
            {
                JToken json = JToken.FromObject(data);

                await _context.Clients.Group(partyName).SendAsync(option.ToString("G"), json);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string partyName = _dataModel.GetUsersParty(Context.ConnectionId);

            if (!string.IsNullOrEmpty(partyName))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, partyName);
            }

            await base.OnDisconnectedAsync(exception);
        }

        [HubMethodName("Start")]
        public async Task<JsonResponse<StartResponse>> Start(StartRequest request)
        {
            var taskResult = await Task.Run(async () =>
            {
                bool started = _dataModel.TryStart(request, Context.ConnectionId, out Result<StartResponse> result);

                if (!started || result.Data == null || result.Data.Party == null || result.Data.User == null)
                {
                    return new JsonResponse<StartResponse>()
                    {
                        Success = false,
                        Data = null,
                        Error = result.Error
                    };
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, request.PartyName);

                result.Data.Party.OnUpdated += BrodcastUpdate;

                return new JsonResponse<StartResponse>()
                {
                    Success = true,
                    Data = result.Data
                };
            });

            return taskResult;
        }

        [HubMethodName("Join")]
        public async Task<JsonResponse<JoinResponse>> Join(JoinRequest request)
        {
            var taskResult = await Task.Run(async () =>
            {
                bool joined = _dataModel.TryJoin(request, Context.ConnectionId, out Result<JoinResponse> result);

                if (!joined)
                {
                    return new JsonResponse<JoinResponse>()
                    {
                        Success = false,
                        Data = null,
                        Error = result.Error
                    };
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, request.PartyName);

                return new JsonResponse<JoinResponse>()
                {
                    Success = true,
                    Data = result.Data
                };
            });

            return taskResult;
        }

        [HubMethodName("SubmitWorkItem")]
        public async Task<JsonResponse<Party>> SubmitWorkItem(WorkItemRequest request)
        {
            var taskResult = await Task.Run(() =>
            {
                bool success = _dataModel.TrySubmitWorkItem(request, out Result<Party> result);

                if (!success)
                {
                    return new JsonResponse<Party>()
                    {
                        Success = false,
                        Data = null,
                        Error = result.Error
                    };
                }

                return new JsonResponse<Party>()
                {
                    Success = true,
                    Data = result.Data
                };
            });

            return taskResult;
        }

        [HubMethodName("SubmitVote")]
        public async Task<JsonResponse<Party>> SubmitVote(VoteRequest request)
        {
            var taskResult = await Task.Run(() =>
            {
                bool success = _dataModel.TrySubmitVote(request, out Result<Party> result);

                if (!success)
                {
                    return new JsonResponse<Party>()
                    {
                        Success = false,
                        Data = null,
                        Error = result.Error
                    };
                }

                return new JsonResponse<Party>()
                {
                    Success = true,
                    Data = result.Data
                };
            });

            return taskResult;
        }

        [HubMethodName("Flip")]
        public async Task<JsonResponse<Party>> Flip(Request request)
        {
            var taskResult = await Task.Run(() =>
            {
                bool success = _dataModel.TryFlip(request, out Result<Party> result);

                if (!success)
                {
                    return new JsonResponse<Party>()
                    {
                        Success = false,
                        Data = null,
                        Error = result.Error
                    };
                }

                return new JsonResponse<Party>()
                {
                    Success = true,
                    Data = result.Data
                };
            });

            return taskResult;
        }

        private void BrodcastUpdate(object sender, Party party)
        {
            _ = BroadcastAsync(BroadcastOption.PartyUpdate, party.Name, party);
        }
    }
}
