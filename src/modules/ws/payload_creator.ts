export const createGamePayload = (
  gameName: string,
  gameType: string,
  gameVersion: string,
): Record<string, unknown> => ({
  game: {
    gameName,
    gameType,
    gameVersion,
  },
});

export const placeholderExportDefault = (): void => {};
