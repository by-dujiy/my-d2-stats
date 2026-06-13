export type Match = {
  match_id: number
  player_slot: number
  radiant_win: boolean
  duration: number
  game_mode: number
  lobby_type: number
  hero_id: number
  start_time: number
  version: number | null
  kills: number
  deaths: number
  assists: number
  average_rank: number | null
  leaver_status: number
  party_size: number | null
  hero_variant: number
}

export async function fetchMatches(accountId: string): Promise<Match[]> {
  const res = await fetch(`https://api.opendota.com/api/players/${accountId}/matches`)
  if (!res.ok) throw new Error(`OpenDota API error: ${res.status}`)
  return res.json()
}
