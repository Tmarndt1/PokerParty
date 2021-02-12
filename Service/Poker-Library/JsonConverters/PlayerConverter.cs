using System;
using System.Diagnostics.CodeAnalysis;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Poker.Library.Models;

namespace Poker.Library.JsonConverters
{
    public class PlayerConverter : JsonConverter<Player>
    {
        public override Player ReadJson(JsonReader reader, Type objectType, [AllowNull] Player existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, [AllowNull] Player value, JsonSerializer serializer)
        {
            ToJObject(value).WriteTo(writer);
        }

        public static JObject ToJObject(Player value)
        {
            return new JObject()
            {
                new JProperty("id", value.ID),
                new JProperty("username", value.Username),
                new JProperty("isAdmin", value.IsAdmin),
                new JProperty("seatNumber", value.SeatNumber),
                new JProperty("v5Count", value.V5Count),
                new JProperty("v10Count", value.V10Count),
                new JProperty("v25Count", value.V25Count),
                new JProperty("v50Count", value.V50Count),
                new JProperty("vote", value.Vote),
                new JProperty("voted", value.Voted),
                new JProperty("voteSuit", value.VoteSuit)
            };
        }
    }
}
