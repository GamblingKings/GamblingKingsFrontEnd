import * as PIXI from 'pixi.js';

import SpriteFactory from '../../../pixi/SpriteFactory';
import Interactions from '../../../pixi/Interactions';

import {
  DEFAULT_MAHJONG_WIDTH,
  DEFAULT_MAHJONG_HEIGHT,
  DISTANCE_FROM_TILES,
  PIXI_TEXT_STYLE,
  FRONT_TILE,
  PLAYER_HAND_SPRITE_X,
  PLAYER_TILE_WIDTH_MULTIPLER,
} from '../../../pixi/mahjongConstants';
import RenderDirection from '../../../pixi/directions';
import UserEntity from '../../game/UserEntity/UserEntity';
import PlayerHand from '../Hand/PlayerHand';
import Tile from '../Tile/Tile';
import { OutgoingAction } from '../../ws';
import WindEnums from '../enums/WindEnums';
import HandValidator from '../HandValidator/HandValidator';
import Timer from '../../game/Timer/Timer';
import validateHandStructure from '../utils/functions/validateHandStructure';
import MeldTypes from '../enums/MeldEnums';
import QuadValidator from '../QuadValidator/QuadValidator';
import PointValidator from '../PointValidator/PointValidator';
import determineTileSize from '../utils/functions/determineTileSize';

const PLAY_TILE_TEXT = 'PLAY_TILE';
const WIN_TEXT = 'WIN ROUND';
const SKIP_TEXT = 'SKIP';
const WAITING_TEXT = 'Waiting for others...';

/**
 * Mahjong player that holds information about current hand (tiles) and render methods
 */
class MahjongPlayer extends UserEntity {
  private hand: PlayerHand;

  private timer: Timer;

  private allowInteraction: boolean;

  private interactionContainer: PIXI.Container;

  constructor(name: string, connectionId: string) {
    super(name, connectionId, RenderDirection.BOTTOM);
    this.hand = new PlayerHand();
    this.allowInteraction = false;
    this.interactionContainer = new PIXI.Container();
    this.timer = new Timer();
  }

  public getHand(): PlayerHand {
    return this.hand;
  }

  public setHand(tiles: Tile[]): boolean {
    return this.hand.setTiles(tiles);
  }

  public resetEverything(): void {
    this.allowInteraction = false;
    this.hand.resetEverything();
    this.removeAllAssets();
  }

  public getInteractionContainer(): PIXI.Container {
    return this.interactionContainer;
  }

  public addTileToHand(tile: Tile): void {
    this.hand.draw(tile);
  }

  public setWindAndFlower(wind: WindEnums, flowerNumber: number): boolean {
    return this.hand.setWind(wind) && this.hand.setFlowerNumber(flowerNumber);
  }

  public setAllowInteraction(permission: boolean): void {
    this.allowInteraction = permission;
  }

  public getAllowInteraction(): boolean {
    return this.allowInteraction;
  }

  public getTimer(): Timer {
    return this.timer;
  }

  /**
   * Removes all children from the container in super class.
   */
  public removeAllAssets(): void {
    const container = super.getContainer();
    container.removeChildren(0, container.children.length);

    this.interactionContainer.removeChildren(0, this.interactionContainer.children.length);
  }

  /**
   * Return a PIXI.container containing all the tile sprites
   * @param spriteFactory SpriteFactory
   * @param callbacks references to functions that so events can send to ws
   */
  public renderHand(
    spriteFactory: SpriteFactory,
    callbacks: Record<string, (...args: unknown[]) => void>,
    canvasRef: React.RefObject<HTMLDivElement>,
  ): PIXI.Container {
    if (canvasRef.current) {
      const { tileWidth, tileHeight } = determineTileSize(canvasRef.current.clientWidth, PLAYER_TILE_WIDTH_MULTIPLER);
      const container = new PIXI.Container();

      const selectedTile = this.hand.getSelectedTile();
      const tiles = this.hand.getTiles();
      const hasDrawn = this.hand.getHasDrawn();
      const lastTile = hasDrawn ? tiles.length - 1 : -1;

      tiles.forEach((tile: Tile, index: number) => {
        const frontSprite = spriteFactory.generateSprite(FRONT_TILE);
        frontSprite.width = tileWidth;
        frontSprite.height = tileHeight;
        frontSprite.x = PLAYER_HAND_SPRITE_X + index * (tileWidth + DISTANCE_FROM_TILES);
        container.addChild(frontSprite);

        const sprite = spriteFactory.generateSprite(tile.toString());
        sprite.width = tileWidth;
        sprite.height = tileHeight;
        sprite.x = PLAYER_HAND_SPRITE_X + index * (tileWidth + DISTANCE_FROM_TILES);

        if (index === selectedTile) {
          sprite.y = -10;
          frontSprite.y = -10;
        }
        if (index === lastTile) {
          sprite.x += DISTANCE_FROM_TILES * 3;
          frontSprite.x += DISTANCE_FROM_TILES * 3;
        }
        Interactions.addMouseInteraction(sprite, (event: PIXI.InteractionEvent) => {
          console.log(event.target);
          this.hand?.setSelectedTile(index);
          callbacks.REQUEST_REDRAW();
        });

        container.addChild(sprite);
      });

      // Render played tiles
      const allMeldsContainer = new PIXI.Container();
      const playedTiles = this.hand.getPlayedTiles();
      playedTiles.forEach((meld: Tile[], index: number) => {
        const meldContainer = new PIXI.Container();
        meld.forEach((tile: Tile, tileIndex: number) => {
          const frontSprite = spriteFactory.generateSprite(FRONT_TILE);
          frontSprite.width = tileWidth;
          frontSprite.height = tileHeight;
          frontSprite.x = PLAYER_HAND_SPRITE_X + tileIndex * (tileWidth + DISTANCE_FROM_TILES);
          frontSprite.y += tileHeight + DISTANCE_FROM_TILES;
          meldContainer.addChild(frontSprite);

          const sprite = spriteFactory.generateSprite(tile.toString());
          sprite.width = tileWidth;
          sprite.height = tileHeight;
          sprite.x = PLAYER_HAND_SPRITE_X + tileIndex * (tileWidth + DISTANCE_FROM_TILES);
          sprite.y += tileHeight + DISTANCE_FROM_TILES;
          meldContainer.addChild(sprite);
        });

        // Give adequate/correct spacing between each meld for readability
        if (index !== 0) {
          const previousMeldLength = playedTiles[index - 1].length;
          // eslint + prettier conflict
          // eslint-disable-next-line operator-linebreak
          meldContainer.x =
            // eslint-disable-next-line operator-linebreak
            (tileWidth + 3 * DISTANCE_FROM_TILES) * previousMeldLength + allMeldsContainer.getChildAt(index - 1).x;
        }

        allMeldsContainer.addChild(meldContainer);
      });
      container.addChild(allMeldsContainer);

      return container;
    }

    return new PIXI.Container();
  }

  /**
   * Returns a PIXI.Text containing the Player's name
   */
  public renderName(): PIXI.Text {
    const name = super.getName();
    const text = new PIXI.Text(name, PIXI_TEXT_STYLE);
    return text;
  }

  public renderInteractionsWithPlayedTile(
    spriteFactory: SpriteFactory,
    callbacks: Record<string, (...args: unknown[]) => void>,
    deadPileTiles: Tile[],
    canCreateConsecutive: boolean,
    currentWind: WindEnums,
    container: PIXI.Container,
  ): void {
    const hand = this.hand.getTiles();
    const playedTile = deadPileTiles[deadPileTiles.length - 1];
    const results = HandValidator.canCreateMeld(hand, playedTile, canCreateConsecutive);

    const allTiles = [...this.hand.getAllTiles(), playedTile].map((tile) => tile.toString());
    // Validate whether player can win
    const canWin = validateHandStructure(
      allTiles,
      this.hand.getWind(),
      this.hand.getFlowerNumber(),
      currentWind,
      false,
    );
    console.log(canWin);
    console.log(results);
    const { quad, triplet, consecutive } = results;

    // Automatically send the skip message if player cannot create a meld.
    if (!quad.canCreate && !triplet.canCreate && !consecutive.canCreate) {
      const payload = {
        skipInteraction: true,
        meldType: '',
        playedTiles: [],
      };
      this.setAllowInteraction(false);
      this.timer.stopTimer();
      callbacks[OutgoingAction.PLAYED_TILE_INTERACTION](payload);
      const waitingText = new PIXI.Text(WAITING_TEXT, PIXI_TEXT_STYLE);
      container.addChild(waitingText);
      callbacks.REQUEST_REDRAW();
      return;
    }

    let canCreateIndex = 0;

    const meldCreateOrder = [quad, triplet, consecutive];

    // Render win text when player can win from played tile
    if (canWin.valid.length > 0 || canWin.isThirteenTerminals) {
      const winText = new PIXI.Text(WIN_TEXT, PIXI_TEXT_STYLE);
      winText.y = (canCreateIndex * DEFAULT_MAHJONG_HEIGHT) / 1.5;
      Interactions.addMouseInteraction(winText, (event: PIXI.InteractionEvent) => {
        console.log(event.target);
        const payload = {
          skipInteraction: false,
          meldType: MeldTypes.WIN,
          playedTiles: allTiles,
        };
        // Extra boolean check might prevent duplicate messages from sending if user double clicks fast enough
        if (this.allowInteraction) {
          this.setAllowInteraction(false);
          callbacks[OutgoingAction.PLAYED_TILE_INTERACTION](payload);
          this.timer.stopTimer();
        }
        callbacks.REQUEST_REDRAW();
      });
      container.addChild(winText);
      canCreateIndex += 1;
    }

    // Render possible melds that player can make.
    // Player can click on the meld container to send message.
    meldCreateOrder.forEach((possibleMeld) => {
      if (possibleMeld.canCreate) {
        possibleMeld.melds.forEach((meld) => {
          const meldContainer = new PIXI.Container();

          meld.tiles.forEach((tile: string, tileIndex: number) => {
            const frontSprite = spriteFactory.generateSprite(FRONT_TILE);
            frontSprite.width = DEFAULT_MAHJONG_WIDTH / 2;
            frontSprite.height = DEFAULT_MAHJONG_HEIGHT / 2;
            frontSprite.x = tileIndex * (DEFAULT_MAHJONG_WIDTH / 2 + DISTANCE_FROM_TILES);

            const tileSprite = spriteFactory.generateSprite(tile);
            tileSprite.width = DEFAULT_MAHJONG_WIDTH / 2;
            tileSprite.height = DEFAULT_MAHJONG_HEIGHT / 2;
            tileSprite.x = tileIndex * (DEFAULT_MAHJONG_WIDTH / 2 + DISTANCE_FROM_TILES);

            meldContainer.addChild(frontSprite);
            meldContainer.addChild(tileSprite);
          });
          meldContainer.y += canCreateIndex * (DEFAULT_MAHJONG_HEIGHT / 2 + DISTANCE_FROM_TILES);

          Interactions.addMouseInteraction(meldContainer as PIXI.Sprite, (event: PIXI.InteractionEvent) => {
            console.log(event.target);
            const payload = {
              meldType: meld.type,
              skipInteraction: false,
              playedTiles: meld.tiles,
            };
            // Extra boolean check might prevent duplicate messages from sending if user double clicks fast enough
            if (this.allowInteraction) {
              this.setAllowInteraction(false);
              callbacks[OutgoingAction.PLAYED_TILE_INTERACTION](payload);
              this.timer.stopTimer();
            }
            callbacks.REQUEST_REDRAW();
          });

          container.addChild(meldContainer);
          canCreateIndex += 1;
        });
      }
    });

    // Skip Interaction
    const skipText = new PIXI.Text(SKIP_TEXT, PIXI_TEXT_STYLE);
    skipText.y = (canCreateIndex * DEFAULT_MAHJONG_HEIGHT) / 1.5;
    Interactions.addMouseInteraction(skipText, (event: PIXI.InteractionEvent) => {
      console.log(event.target);
      const payload = {
        skipInteraction: true,
        meldType: '',
        playedTiles: [],
      };
      // Extra boolean check might prevent duplicate messages from sending if user double clicks fast enough
      if (this.allowInteraction) {
        this.setAllowInteraction(false);
        callbacks[OutgoingAction.PLAYED_TILE_INTERACTION](payload);
        this.timer.stopTimer();
      }
      callbacks.REQUEST_REDRAW();
    });
    container.addChild(skipText);
  }

  /**
   * Adds assets with interactions for additional functionality (like pong and kong)
   * @param spriteFactory SpriteFactory
   * @param callbacks references to functions that so events can send to ws
   */
  public renderInteractions(
    spriteFactory: SpriteFactory,
    callbacks: Record<string, (...args: unknown[]) => void>,
    deadPileTiles: Tile[],
    canCreateConsecutive: boolean,
    currentWind: WindEnums,
    canvasRef: React.RefObject<HTMLDivElement>,
  ): void {
    const container = new PIXI.Container();

    if (canvasRef.current) {
      const { tileWidth, tileHeight } = determineTileSize(canvasRef.current.clientWidth, PLAYER_TILE_WIDTH_MULTIPLER);
      container.x = 200 + this.hand.getTiles().length * tileWidth;

      let yPositionIndex = 1;
      const canPlayTile = this.hand.canPlayTile();
      // Render play button if player has drawn or can play tile after making meld.
      if (canPlayTile) {
        const playText = new PIXI.Text(PLAY_TILE_TEXT, PIXI_TEXT_STYLE);
        container.addChild(playText);
        Interactions.addMouseInteraction(playText, (event: PIXI.InteractionEvent) => {
          console.log(event.target);
          const tile = this.hand.throw();
          if (tile !== null) {
            callbacks[OutgoingAction.PLAY_TILE](tile.toString());
          }
        });

        // Render win button if player can win from drawing
        const allTiles = this.hand.getAllTiles().map((tile) => tile.toString());
        const canWin = validateHandStructure(
          allTiles,
          this.hand.getWind(),
          this.hand.getFlowerNumber(),
          currentWind,
          this.hand.getConcealed(),
        );
        if (canWin.valid.length > 0 || canWin.isThirteenTerminals) {
          const winText = new PIXI.Text(WIN_TEXT, PIXI_TEXT_STYLE);
          winText.y = yPositionIndex * (tileHeight / 2);
          Interactions.addMouseInteraction(winText, (event: PIXI.InteractionEvent) => {
            console.log(event.target);
            if (canPlayTile) {
              this.getHand().setCannotPlayTile();
              const pointsResult = PointValidator.validateHandPoints(canWin);
              const payload = {
                handPointResults: pointsResult.largestHand,
              };
              callbacks[OutgoingAction.WIN_ROUND](payload);
              callbacks.REQUEST_REDRAW();
            }
          });
          container.addChild(winText);
          yPositionIndex += 1;
        }

        // Render quads if player can make quads
        const quads = QuadValidator.checkForQuads(this.getHand());
        if (quads) {
          quads.forEach((quadResult) => {
            const quadContainer = new PIXI.Container();
            quadContainer.y = yPositionIndex * (tileHeight / 2 + DISTANCE_FROM_TILES);
            const { alreadyMeld, tile } = quadResult;
            const tileString = tile.toString();
            for (let i = 0; i < 4; i += 1) {
              const frontSprite = spriteFactory.generateSprite(FRONT_TILE);
              frontSprite.width = tileWidth / 2;
              frontSprite.height = tileHeight / 2;
              frontSprite.x = i * (tileWidth / 2 + DISTANCE_FROM_TILES);

              const tileSprite = spriteFactory.generateSprite(tileString);
              tileSprite.width = tileWidth / 2;
              tileSprite.height = tileHeight / 2;
              tileSprite.x = i * (tileWidth / 2 + DISTANCE_FROM_TILES);
              quadContainer.addChild(frontSprite);
              quadContainer.addChild(tileSprite);
            }
            Interactions.addMouseInteraction(quadContainer as PIXI.Sprite, (event: PIXI.InteractionEvent) => {
              console.log(event.target);
              const payload = {
                playedTile: tileString,
                isQuad: true,
                alreadyMeld,
              };
              // Extra boolean check might prevent duplicate messages from sending if user double clicks fast enough
              if (canPlayTile) {
                this.getHand().setCannotPlayTile();
                callbacks[OutgoingAction.SELF_PLAY_TILE](payload);
                callbacks.REQUEST_REDRAW();
              }
            });
            container.addChild(quadContainer);
            yPositionIndex += 1;
          });
        }
      }
    }

    // Render interaction buttons when player is prompted to.
    if (this.allowInteraction && deadPileTiles.length > 0) {
      this.renderInteractionsWithPlayedTile(
        spriteFactory,
        callbacks,
        deadPileTiles,
        canCreateConsecutive,
        currentWind,
        container,
      );
    }

    this.interactionContainer.addChild(container);
  }

  /**
   * Create assets and appends assets to the container in super class, and attaches to the application stage.
   * @param spriteFactory SpriteFactory
   * @param pixiStage PIXI.Container
   * @param isUserTurn boolean indicating if it is current user's turn
   * @param callbacks references to functions that so events can send to ws
   */
  public render(
    spriteFactory: SpriteFactory,
    pixiStage: PIXI.Container,
    isUserTurn: boolean,
    canvasRef: React.RefObject<HTMLDivElement>,
    callbacks: Record<string, () => void>,
  ): void {
    const playerContainer = super.getContainer();
    if (isUserTurn) {
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0x3498db);
      graphics.drawCircle(0, 0, 20);
      playerContainer.addChild(graphics);
    }
    const playerHand = this.renderHand(spriteFactory, callbacks, canvasRef);
    const name = this.renderName();
    // this.renderInteractions(spriteFactory, callbacks);

    name.y = playerHand.y - 50;
    name.x = playerHand.x + playerHand.width / 2;

    playerContainer.addChild(name);
    playerContainer.addChild(playerHand);
    playerContainer.addChild(this.interactionContainer);

    pixiStage.addChild(playerContainer);
  }
}

export default MahjongPlayer;
