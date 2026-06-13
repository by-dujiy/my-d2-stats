import { pgTable, bigint, integer, boolean, smallint } from "drizzle-orm/pg-core";

export const matches = pgTable('matches', {
    matchId:      bigint('match_id', { mode: 'number' }).primaryKey(),
    playerSlot:   smallint('player_slot').notNull(),
    radiantWin:   boolean('radiant_win').notNull(),
    duration:     integer('duration').notNull(),
    gameMode:     smallint('game_mode').notNull(),
    lobbyType:    smallint('lobby_type').notNull(),
    heroId:       integer('hero_id').notNull(),
    startTime:    integer('start_time').notNull(),
    version:      integer('version'),
    kills:        smallint('kills').notNull(),
    deaths:       smallint('deaths').notNull(),
    assists:      smallint('assists').notNull(),
    averageRank:  smallint('average_rank'),
    leaverStatus: smallint('leaver_status').notNull(),
    partySize:    smallint('party_size'),
    heroVariant:  smallint('hero_variant'),
})