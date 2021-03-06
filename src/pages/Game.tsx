import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { useHistory } from 'react-router-dom';
import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import RenderDirection from '../pixi/directions';
import { WebSocketConnection, OutgoingAction, IncomingAction } from '../modules/ws';
import {
  GamePageLoadJSON,
  GameStartJSON,
  Game,
  CurrentUser,
  User,
  DrawTileJSON,
  PlayTileJSON,
  InteractionSuccessJSON,
  PlayedTileInteractionJSON,
  SelfPlayTileJSON,
  SelfPlayedTile,
  WinningTilesJSON,
  UpdateGameStateJSON,
  DrawRoundJSON,
} from '../types';
import GameTypes from '../modules/game/gameTypes';
import MahjongOpponent from '../modules/mahjong/MahjongOpponent/MahjongOpponent';
import MahjongPlayer from '../modules/mahjong/MahjongPlayer/MahjongPlayer';
import TileFactory from '../modules/mahjong/Tile/TileFactory';
import GameState from '../modules/game/GameState/GameState';
import MahjongGameState from '../modules/mahjong/MahjongGameState/MahjongGameState';
import { isBonusTile } from '../modules/mahjong/utils/functions/checkTypes';
import MeldTypes from '../modules/mahjong/enums/MeldEnums';
import validateHandStructure from '../modules/mahjong/utils/functions/validateHandStructure';
import PointValidator from '../modules/mahjong/PointValidator/PointValidator';
import convertStrArrToTileArr from '../modules/mahjong/utils/functions/convertStrArrToTileArr';
import Tile from '../modules/mahjong/Tile/Tile';

/**
 * Pixi Application References
 */
let pixiApplication: PIXI.Application;
let pixiLoader: PIXI.Loader;
let interactionManager: PIXI.InteractionManager;
let spriteFactory: SpriteFactory;

/**
 * Game State
 */
let gameState: GameState;

type GameProps = {
  ws: WebSocketConnection | null;
  currentUser: CurrentUser;
};

/**
 * Game Page for main game
 */
const GamePage = ({ ws, currentUser }: GameProps): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);

  /**
   * Game reference is passed from GameLobby through history.push
   */
  const history = useHistory();
  const { state } = history.location;
  const { game } = state as { game: Game };

  /**
   * Callbacks required for adding interaction to PIXI assets.
   */
  const wsCallbacks: Record<string, (...args: unknown[]) => void> = {
    [OutgoingAction.DRAW_TILE]: () => {
      ws?.sendMessage(OutgoingAction.DRAW_TILE, { gameId: game.gameId });
    },
    [OutgoingAction.PLAY_TILE]: (tile: unknown) => {
      ws?.sendMessage(OutgoingAction.PLAY_TILE, { gameId: game.gameId, tile });
      const mjGameState = gameState as MahjongGameState;
      mjGameState.requestRedraw();
    },
    [OutgoingAction.PLAYED_TILE_INTERACTION]: (params: unknown) => {
      const payload = params as Record<string, unknown>;
      ws?.sendMessage(OutgoingAction.PLAYED_TILE_INTERACTION, { gameId: game.gameId, ...payload });
    },
    [OutgoingAction.SELF_PLAY_TILE]: (params: unknown) => {
      const payload = params as Record<string, unknown>;
      ws?.sendMessage(OutgoingAction.SELF_PLAY_TILE, { gameId: game.gameId, ...payload });
    },
    [OutgoingAction.WIN_ROUND]: (params: unknown) => {
      const payload = params as Record<string, unknown>;
      ws?.sendMessage(OutgoingAction.WIN_ROUND, { gameId: game.gameId, ...payload });
    },
    REQUEST_REDRAW: () => {
      const mjGameState = gameState as MahjongGameState;
      mjGameState.requestRedraw();
    },
  };

  /**
   * Initialize the GameState
   * @param currentGame Game
   */
  const gameStateInit = (currentGame: Game) => {
    const { users } = currentGame;

    const indexOfCurrentUser = users.findIndex((user: User) => user.username === currentUser.username);
    const allUserEntities = [];
    const directions = [RenderDirection.LEFT, RenderDirection.TOP, RenderDirection.RIGHT];
    let currentIndex = indexOfCurrentUser + 1;
    for (let i = 0; i < users.length - 1; i += 1) {
      if (currentIndex >= users.length) {
        currentIndex = 0;
      }
      const opponent = new MahjongOpponent(
        users[currentIndex].username,
        users[currentIndex].connectionId,
        directions[i],
      );
      allUserEntities[currentIndex] = opponent;
      currentIndex += 1;
    }
    const player = new MahjongPlayer(currentUser.username, users[indexOfCurrentUser].connectionId);
    allUserEntities[indexOfCurrentUser] = player;
    gameState = new MahjongGameState(allUserEntities, player as MahjongPlayer, wsCallbacks);
  };

  /**
   * Main Animation loop
   */
  function animate() {
    const mjGameState = gameState as MahjongGameState;
    mjGameState.update();
    mjGameState.renderCanvas(spriteFactory, pixiApplication, canvasRef);
    requestAnimationFrame(animate);
  }

  /**
   * Listener Callbacks
   */

  /**
   * For GAME_PAGE_LOAD
   * @param payload GamePageLoadJSON
   */
  const confirmGamePageLoadReceived = (payload: unknown): void => {
    const data = payload as GamePageLoadJSON;
    const { success, error } = data;
    if (success) {
      ws?.removeListener(IncomingAction.GAME_PAGE_LOAD);
    } else {
      console.log(`Error processing GAME_PAGE_LOAD: ${error}`);
      ws?.sendMessage(OutgoingAction.GAME_PAGE_LOAD, { gameId: game.gameId });
    }
  };

  /**
   * For GAME_START
   * @param payload GameStartJSON
   */
  const gameStartInit = (payload: unknown): void => {
    const data = payload as GameStartJSON;
    const { tiles: tileArray, selfPlayedTiles, currentIndex } = data;

    const mjGameState = gameState as MahjongGameState;

    // Increment wall counter
    const wallCounter = mjGameState.getWallCounter();
    const result = wallCounter.setCurrentIndex(currentIndex);
    if (!result) console.error('Failed to set wall counter. Please verify game state');

    // Set player hand
    const tiles = convertStrArrToTileArr(tileArray);
    const mjPlayer = mjGameState.getMjPlayer() as MahjongPlayer;
    mjPlayer.setHand(tiles);
    const mjPlayerHand = mjPlayer.getHand();

    // Set player played tiles (bonus tiles) at game start
    const playerPlayedTileObjs = selfPlayedTiles.find(
      (playedTiles: SelfPlayedTile) => playedTiles.connectionId === mjPlayer.getConnectionId(),
    ) as SelfPlayedTile;
    const mjPlayerBonusTilesStrDef = playerPlayedTileObjs.playedTiles;

    // Only add to playedTiles if its not empty (has bonus tiles in the array)
    if (mjPlayerBonusTilesStrDef.length !== 0) {
      const mjPlayerBonusTiles = convertStrArrToTileArr(mjPlayerBonusTilesStrDef);
      mjPlayerHand.addPlayedTiles(mjPlayerBonusTiles);
    }
    console.log(
      `Game - gameStartInit():\n Player '${mjPlayer.getName()}', playerBonusTiles: [${mjPlayerBonusTilesStrDef}]`,
    );

    // Get opponents in mjGameState
    const mjOpponents = mjGameState
      .getUsers()
      .filter((user) => user.getConnectionId() !== mjPlayer.getConnectionId()) as MahjongOpponent[];
    const opponentsBonusTilesObjs = selfPlayedTiles.filter(
      (playedTiles) => playedTiles.connectionId !== mjPlayer.getConnectionId(),
    );

    // Set opponents played tiles (bonus tiles) at game start
    let errorAddingBonusTiles = false;
    const failedOpponents: MahjongOpponent[] = [];
    mjOpponents.forEach((opponent) => {
      const opponentHand = opponent.getHand();
      const opponentPlayedTileObj = opponentsBonusTilesObjs.find(
        (obj) => obj.connectionId === opponent.getConnectionId(),
      );
      if (opponentPlayedTileObj) {
        const opponentPlayedTilesStrDef = opponentPlayedTileObj.playedTiles;
        // Only add to playedTiles if its not empty (has bonus tiles in the array)
        if (opponentPlayedTilesStrDef.length !== 0) {
          const opponentBonusTiles = convertStrArrToTileArr(opponentPlayedTilesStrDef);
          opponentHand.addSelfPlayedTiles(opponentBonusTiles);
        }

        console.log(
          `Game gameStartInit:\n Opponent '${opponent.getName()}', opponentBonusTiles: [${opponentPlayedTilesStrDef}]`,
        );
      } else {
        // Failed to find opponent's playedTileObj
        errorAddingBonusTiles = true;
        failedOpponents.push(opponent);
      }
    });

    if (errorAddingBonusTiles) console.error('Opponent failed to add bonus tiles to playedTiles:', failedOpponents);

    const readyToGo = mjGameState.startRound();

    if (!readyToGo) {
      console.error('Game start error. Verify the game state.');
    }

    /**
     * Loops animation frame if game hasn't started
     * Otherwise, request redraw.
     */
    if (!mjGameState.getGameStarted()) {
      mjGameState.setGameStarted(true);
      animate();
    } else {
      mjGameState.requestRedraw();
    }
  };

  /**
   * For DRAW_TILE
   * @param payload DrawTileJSON
   */
  const mjGameDrawTile = (payload: unknown): void => {
    const data = payload as DrawTileJSON;
    const { tile: tileStr, currentIndex } = data;
    const tile = TileFactory.createTileFromStringDef(tileStr);

    const mjGameState = gameState as MahjongGameState;
    const mjPlayer = mjGameState.getMjPlayer();

    mjPlayer.addTileToHand(tile);

    mjGameState.getWallCounter().setCurrentIndex(currentIndex);

    // Send SELF_PLAY_TILE if tile is a Bonus Tile
    if (isBonusTile(tileStr)) {
      mjPlayer.getHand().setCannotPlayTile();
      const wsPayload = {
        gameId: game.gameId,
        playedTile: data.tile,
        isQuad: false,
        alreadyMeld: false,
      };
      ws?.sendMessage(OutgoingAction.SELF_PLAY_TILE, wsPayload);
    }
    mjGameState.requestRedraw();
  };

  /**
   * For PLAY_TILE
   * @param payload PlayTileJSON
   */
  const mjGamePlayTile = (payload: unknown): void => {
    const data = payload as PlayTileJSON;
    const tile = TileFactory.createTileFromStringDef(data.tile);
    const mjGameState = gameState as MahjongGameState;
    mjGameState.getDeadPile().add(tile);

    const mjPlayer = mjGameState.getMjPlayer();

    // Ask for interaction if player was not the one who played tile
    if (data.connectionId !== mjPlayer.getConnectionId()) {
      const users = mjGameState.getUsers();
      // Change state that the opponent has played a tile.
      const opponentIndex = users.findIndex((user) => user.getConnectionId() === data.connectionId);
      if (opponentIndex !== -1) {
        const opponent = users[opponentIndex] as MahjongOpponent;
        opponent.playedTile();
      } else {
        console.error('Game state error. Desync is likely to happen.');
      }

      mjPlayer.setAllowInteraction(true);
      const timer = mjPlayer.getTimer();
      // Set and start timer
      timer.setCallback(() => {
        const wsPayload = {
          skipInteraction: true,
          meldType: '',
          playedTiles: [],
        };
        wsCallbacks[OutgoingAction.PLAYED_TILE_INTERACTION](wsPayload);
        mjPlayer.setAllowInteraction(false);
        wsCallbacks.REQUEST_REDRAW();
      });
      timer.startTimer(new Date().getTime(), 7500);
    } else {
      // TODO (NextPR): Display msg to player who played tile to wait while others make decision
    }
    mjGameState.requestRedraw();
  };

  /**
   * For PLAYED_TILE_INTERACTION
   * @param payload PlayedTileInteraction
   */
  const mjPlayedTileInteraction = (payload: unknown): void => {
    const data = payload as PlayedTileInteractionJSON;
    // eslint-disable-next-line object-curly-newline
    const { playedTiles, skipInteraction, meldType, success } = data;
    // If there was an error with processing PLAYED_TILE_INTERACTION, resend message
    if (!success) {
      ws?.sendMessage(OutgoingAction.PLAYED_TILE_INTERACTION, {
        playedTiles,
        skipInteraction,
        meldType,
        gameId: game.gameId,
      });
    }
  };

  /**
   * For INTERACTION_SUCCESS
   * @param payload InteractionSuccessJSON
   */
  const mjInteractionSuccess = (payload: unknown): void => {
    const data = payload as InteractionSuccessJSON;
    const mjGameState = gameState as MahjongGameState;
    const mjPlayer = mjGameState.getMjPlayer();

    if (data.skipInteraction) {
      // If everybody skips, game can proceed normally
      mjGameState.goToNextTurn();

      const userIndex = mjGameState.getCurrentTurn();
      const currentUserEntity = mjGameState.getUsers()[userIndex];

      // If it's user's turn, player can draw tile
      if (currentUserEntity.getConnectionId() === mjPlayer.getConnectionId()) {
        ws?.sendMessage(OutgoingAction.DRAW_TILE, { gameId: game.gameId });
      } else {
        // Change state that opponent will draw a tile
        const opponent = currentUserEntity as MahjongOpponent;
        opponent.drawTile();
      }
      // Increase wall counter
      mjGameState.getWallCounter().increaseCounter();
    } else {
      const { connectionId, playedTiles: playedTilesStr, meldType } = data;
      // Remove last tile from deadpile
      const playedTile = mjGameState.getDeadPile().removeLastTile() as Tile;
      if (connectionId && playedTilesStr && meldType) {
        const playedTiles = convertStrArrToTileArr(playedTilesStr);
        const userIndex = mjGameState.getUsers().findIndex((user) => user.getConnectionId() === connectionId);

        // Player Interactions
        if (connectionId === mjPlayer.getConnectionId()) {
          // Send WIN_ROUND
          if (meldType === MeldTypes.WIN) {
            const playerHand = mjPlayer.getHand();
            const allTiles = [...playerHand.getAllTiles(), playedTile].map((tile) => tile.toString());
            const handValidationResult = validateHandStructure(
              allTiles,
              playerHand.getWind(),
              playerHand.getFlowerNumber(),
              mjGameState.getCurrentWind(),
              playerHand.getConcealed(),
            );
            const pointValidationResult = PointValidator.validateHandPoints(handValidationResult);
            const wsPayload = {
              gameId: game.gameId,
              handPointResults: pointValidationResult.largestHand,
            };
            ws?.sendMessage(OutgoingAction.WIN_ROUND, wsPayload);
            return;
          }

          // Draw a tile if Meld is a QUAD
          if (meldType === MeldTypes.QUAD) {
            ws?.sendMessage(OutgoingAction.DRAW_TILE, { gameId: game.gameId });
          }

          // Player updates their PlayedTiles
          mjPlayer.getHand().addPlayedTiles(playedTiles);

          const indexOfPlayedTile = playedTiles.findIndex((tile) => playedTile?.toString() === tile.toString());
          if (indexOfPlayedTile !== -1) {
            const tilesToRemove = [...playedTiles];
            tilesToRemove.splice(indexOfPlayedTile, 1);
            mjPlayer.getHand().removeTiles(tilesToRemove);
          } else {
            console.error('Hand state error, could not remove tiles');
          }

          mjPlayer.getHand().setMadeMeld(true);
        } else {
          // Stop processing and wait for WINNING_TILES
          if (meldType === MeldTypes.WIN) {
            return;
          }
          // Increase counter as Opponent needs to draw tile under the hood
          if (meldType === MeldTypes.QUAD) {
            mjGameState.getWallCounter().increaseCounter();
          }
          // Opponent update playedTiles
          const opponent = mjGameState.getUsers()[userIndex] as MahjongOpponent;
          opponent.getHand().addPlayedTiles(playedTiles);
        }
        // Set turn to the person who interacted successfully
        mjGameState.setTurn(userIndex);
      }
    }

    mjGameState.requestRedraw();
  };

  /**
   * For SELF_PLAY_TILE
   * @param payload SelfPlayTileJSON
   */
  const mjSelfPlayTile = (payload: unknown): void => {
    const data = payload as SelfPlayTileJSON;
    const mjGameState = gameState as MahjongGameState;
    const mjPlayer = mjGameState.getMjPlayer();
    // eslint-disable-next-line
    const { connectionId, playedTile, isQuad, alreadyMeld } = data;
    const tile = TileFactory.createTileFromStringDef(playedTile);

    if (connectionId === mjPlayer.getConnectionId()) {
      const hand = mjPlayer.getHand();
      // Form a quad
      if (isQuad) {
        hand.formQuad(tile, alreadyMeld);
      } else {
        // Add Bonus Tile to Played Tiles
        hand.addPlayedTiles([tile]);
        hand.removeTiles([tile]);
      }
      ws?.sendMessage(OutgoingAction.DRAW_TILE, { gameId: game.gameId });
    } else {
      const userIndex = mjGameState.getUsers().findIndex((user) => user.getConnectionId() === connectionId);
      const opponent = mjGameState.getUsers()[userIndex] as MahjongOpponent;
      const opponentHand = opponent.getHand();
      if (isQuad) {
        opponentHand.formQuad(tile, alreadyMeld);
      } else {
        // Add Bonus Tile to Played Tiles
        opponentHand.addSelfPlayedTiles([tile]);
      }
    }
    mjGameState.requestRedraw();
  };

  /**
   * For WINNING_TILES
   * @param payload WinningTilesJSON
   */
  const mjWinningTiles = (payload: unknown): void => {
    const data = payload as WinningTilesJSON;
    const { connectionId, handPointResults } = data;
    const mjGameState = gameState as MahjongGameState;
    mjGameState.endRound();
    mjGameState.winnerFound();
    mjGameState.setWinnerInfo(connectionId, handPointResults);
    mjGameState.requestRedraw();
  };

  /**
   * For UPDATE_GAME_STATE
   * @param payload UpdateGameStateJSON
   */
  const mjUpdateGameState = (payload: unknown): void => {
    const data = payload as UpdateGameStateJSON;
    const { dealer, wind } = data;
    const mjGameState = gameState as MahjongGameState;
    mjGameState.gameStateSync(dealer, wind);
    mjGameState.resetEverything();
  };

  /**
   * For DRAW_ROUND
   * @param payload DrawRoundJSON
   */
  const mjDrawRound = (payload: unknown): void => {
    const data = payload as DrawRoundJSON;
    console.log(data);
    const mjGameState = gameState as MahjongGameState;
    mjGameState.endRound();
    mjGameState.requestRedraw();
  };

  // Set up PIXI application.
  useEffect(() => {
    /**
     * Launches PIXI Application
     */
    pixiApplication = new PIXI.Application({
      width: canvasRef.current?.clientWidth,
      height: canvasRef.current?.clientHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
      resizeTo: window,
    });
    /**
     * Attaches PixiJS view to HTML canvas element
     */
    if (canvasRef !== null && canvasRef.current !== null) {
      canvasRef.current.appendChild(pixiApplication.view);
    }
    /**
     * Save application managers for reference
     */
    interactionManager = pixiApplication.renderer.plugins.interaction;
    pixiLoader = pixiApplication.loader;
    console.log(interactionManager);

    /**
     * Function setup invoked when assets are done loading
     */
    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>): void {
      console.log(loader);
      if (ws) {
        ws.sendMessage(OutgoingAction.GAME_PAGE_LOAD, { gameId: game.gameId });
      }
      gameStateInit(game);
      /**
       * Load resources (images) into Sprite Factory
       */
      spriteFactory = new SpriteFactory(resources);
    }
    const images = imageInit(game.gameType as GameTypes);
    pixiLoader.add(images).load(setup);
    // eslint-disable-next-line
  }, []);

  /**
   * Setup WS listeners
   */
  useEffect(() => {
    if (ws) {
      ws.addListener(IncomingAction.GAME_PAGE_LOAD, confirmGamePageLoadReceived);
      ws.addListener(IncomingAction.GAME_START, gameStartInit);
      ws.addListener(IncomingAction.DRAW_TILE, mjGameDrawTile);
      ws.addListener(IncomingAction.PLAY_TILE, mjGamePlayTile);
      ws.addListener(IncomingAction.INTERACTION_SUCCESS, mjInteractionSuccess);
      ws.addListener(IncomingAction.PLAYED_TILE_INTERACTION, mjPlayedTileInteraction);
      ws.addListener(IncomingAction.SELF_PLAY_TILE, mjSelfPlayTile);
      ws.addListener(IncomingAction.WINNING_TILES, mjWinningTiles);
      ws.addListener(IncomingAction.UPDATE_GAME_STATE, mjUpdateGameState);
      ws.addListener(IncomingAction.DRAW_ROUND, mjDrawRound);
    }

    return function cleanup() {
      if (ws) {
        ws.removeListener(IncomingAction.GAME_PAGE_LOAD);
        ws.removeListener(IncomingAction.GAME_START);
        ws.removeListener(IncomingAction.DRAW_TILE);
        ws.removeListener(IncomingAction.PLAY_TILE);
        ws.removeListener(IncomingAction.INTERACTION_SUCCESS);
        ws.removeListener(IncomingAction.PLAYED_TILE_INTERACTION);
        ws.removeListener(IncomingAction.SELF_PLAY_TILE);
        ws.removeListener(IncomingAction.WINNING_TILES);
        ws.removeListener(IncomingAction.UPDATE_GAME_STATE);
        ws.removeListener(IncomingAction.DRAW_ROUND);
      }
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Listens for resizing of window
   */
  useEffect(() => {
    function handleResize() {
      const mjGameState = gameState as MahjongGameState;
      mjGameState.requestRedraw();
    }
    window.addEventListener('resize', handleResize);

    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  });

  return <div ref={canvasRef} />;
};

export default GamePage;
