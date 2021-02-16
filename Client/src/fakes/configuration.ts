import { Party } from "../models/Party";
import { Guid } from "../utilitites/common";
import PokerItem from "../models/PokerItem";
import { Player, CardSuit } from "../models/Player";

export let fakeAdmin = new Player({
    id: Guid(),
    partyName: "Fake party",
    username: "Player 1",
    isActive: true,
    vote: null,
    voted: true,
    isAdmin: true,
    connectionId: "",
    seatNumber: 1,
    v5Count: Math.ceil(Math.random() * 10),
    v10Count: Math.ceil(Math.random() * 10),
    v25Count: Math.ceil(Math.random() * 10),
    v50Count: Math.ceil(Math.random() * 10),
    voteSuit: CardSuit.Spades,
    lastVote: null
});

let members: Player[] = [ fakeAdmin ];

for (let i = 2; i < 11; i++) {
    let player = fakeAdmin.clone();
    player.username = "Player " + i,
    player.id = Guid();
    player.isAdmin = false;
    player.seatNumber = i;
    // player.voted = i % 2 == 0;
    player.voted = false;
    player.v5Count = Math.ceil(Math.random() * 10);
    player.v10Count = Math.ceil(Math.random() * 10);
    player.v25Count = Math.ceil(Math.random() * 10);
    player.v50Count = Math.ceil(Math.random() * 10);
    members.push(player);
}

export let fakeParty = new Party({
    id: Guid(),
    name: "BIT",
    members: members,
    pokerItem: new PokerItem(),
    itemHistory: [],
    voting: false
});