enum SocketEvent {
    Connect = "connect",
    Connection = "connection", //backend only
    Disconnect = "disconnect",
    JoinParty = "joinParty",
    StartParty = "startParty",
    GetPokerPlayers = "getPokerPlayers",
    GetParties = "getParties",
    GetParty = "getParty",
    Vote = "vote",
    Reset = "reset",
    ItemSubmmitted = "itemSubmmitted",
    LocalClosed = "localClosed",
    OtherClosed = "otherClosed",
    SubmitItem = "submitItem",
    RevoteItem = "revoteItem",
    PartyAdded = "partyAdded",
    PlayerAdded = "playerAdded",
    PlayerVoted = "playerVoted",
    PlayerRemoved = "playerRemoved",
    RemovePlayer = "removePlayer"
}

export default SocketEvent;