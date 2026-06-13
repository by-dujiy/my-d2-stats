import { NextResponse } from 'next/server'
import { fetchMatches } from '@/lib/opendota'
import { db } from '@/lib/db'
import { matches } from '@/lib/schema'

export async function POST() {
  const accountId = process.env.STEAM_ACCOUNT_ID!
  const data = await fetchMatches(accountId)

  await db.insert(matches).values(
    data.map((m) => ({
      matchId:      m.match_id,
      playerSlot:   m.player_slot,
      radiantWin:   m.radiant_win,
      duration:     m.duration,
      gameMode:     m.game_mode,
      lobbyType:    m.lobby_type,
      heroId:       m.hero_id,
      startTime:    m.start_time,
      version:      m.version,
      kills:        m.kills,
      deaths:       m.deaths,
      assists:      m.assists,
      averageRank:  m.average_rank,
      leaverStatus: m.leaver_status,
      partySize:    m.party_size,
      heroVariant:  m.hero_variant,
    }))
  ).onConflictDoNothing()

  return NextResponse.json({ synced: data.length })
}
