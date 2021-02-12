using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Poker.Library.Models;

namespace Poker.Library.JsonConverters
{
    public class PartyConverter : JsonConverter<Party>
    {
        public override Party ReadJson(JsonReader reader, Type objectType, [AllowNull] Party existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, [AllowNull] Party value, JsonSerializer serializer)
        {
            ToJObject(value).WriteTo(writer);
        }

        public static JObject ToJObject(Party value)
        {
            return new JObject()
            {
                new JProperty("id", value.ID),
                new JProperty("name", value.Name),
                new JProperty("pokerItem", value.PokerItem),
                new JProperty("voting", value.Voting),
                new JProperty("members", value.Members.Values.Select(member => PlayerConverter.ToJObject(member)))
            };
        }
    }
}
