# WebSocket Listeners

This documentation outlines the messages going out of and coming into the client <br /><br />

The title suggests

## Outgoing from Client

Messages that are sent from the client so the WebSocket API can act upon it.

### `SET_USERNAME`

Payload: { username: \$username }

- \$username: username that the client wants to take

### `USERS`

Payload: {}

### `GAMES`

Payload: {}

## Incoming to Client

Messages that are sent from WebSocket API so that the client can act upon it.

### `USERS`

Payload: { users: [{user}] }

### `GAMES`

Payload: { games: [{game}] }