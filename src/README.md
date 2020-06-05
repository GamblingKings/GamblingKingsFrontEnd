# WebSocket Listeners

This documentation outlines the messages going out of and coming into the client <br /><br />

The title indicates what the request.body.action value must be.

## Outgoing from Client

Messages that are sent from the client so the WebSocket API can act upon it.

### `SET_USERNAME`

Payload: { username: \$username }

- \$username: username that the client wants to take

### `GET_ALL_USERS`

Payload: {}

### `GET_ALL_GAMES`

Payload: {}

### `CREATE_GAME`

Payload: { gameName: $gameName, gameType: $gameType, gameVersion: \$gameVersion }

- \$gameName: string specified by the client of what their game room should be named
- \$gameType: Mahjong or BigTwo
- \$gameVersion: (Chinese or Vietnamese if BigTwo), (HongKong if Mahjong)

### `SEND_MESSAGE`

Payload: { message: \$message }

- \$message: string that gets sent to other clients

## Incoming to Client

Messages that are sent from WebSocket API so that the client can act upon it.

### `GET_ALL_USERS`

Payload: { users: [{user}] }

### `GET_ALL_GAMES`

Payload: { games: [{game}] }

### `SEND_MESSAGE`

Payload: { message: \$message }

- \$message: string that another client has sent
