import { Party } from "../models/Party";
import { Guid } from "../utilitites/common";
import WorkItem from "../models/WorkItem";
import { Player, CardSuit } from "../models/Player";

export let fakeAdmin = new Player({
    key: Guid(),
    partyName: "Fake party",
    username: "Player 1",
    isActive: true,
    vote: "5",
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

let seatsUsed: number[] = [fakeAdmin.seatNumber];

function getRandomSeat(): number {
    let seat: number =  Math.round(Math.random() * 10);

    let maxIterations: number = 200;

    while (true && --maxIterations > 0) {
        if (!seatsUsed.includes(seat) && seat !== 1 && seat !== 0) {
            seatsUsed.push(seat);
            break;
        }

        seat = Math.round(Math.random() * 10);
    }

    return seat;
}

for (let i = 2; i < 8; i++) {
    let player = fakeAdmin.clone();
    player.username = "Player " + i,
    player.key = Guid();
    player.isAdmin = false;
    player.seatNumber = getRandomSeat();
    // player.voted = i % 2 == 0;
    player.voted = false;
    player.v5Count = Math.ceil(Math.random() * 10);
    player.v10Count = Math.ceil(Math.random() * 10);
    player.v25Count = Math.ceil(Math.random() * 10);
    player.v50Count = Math.ceil(Math.random() * 10);
    members.push(player);
}

export let fakeParty = new Party({
    key: Guid(),
    name: "Team Name",
    members: members,
    workItem: new WorkItem({
        key: "fake",
        title: "title",
        body: "body",
        active: true
    }),
    voting: false,
    flipped: true
});
