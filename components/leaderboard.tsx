"use client"

import { useState, useEffect } from "react"
import { TopUser } from "@/components/top-user"
import { MessageSquare, Trophy, Loader2 } from "lucide-react"

type Period = "day" | "week" | "month"

const periodLabels: Record<Period, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
}

interface UserData {
  user_id: number
  username: string
  first_name: string
  avatar_url: string | null

  day_count: number
  week_count: number
  month_count: number
  total_count: number
}

interface LeaderboardData {
  items: UserData[]
}

// 🔑 Supabase env
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 🔗 Edge Function
const API_URL = `${SUPABASE_URL}/functions/v1/smooth-service`

function getMessageCount(user: UserData, period: Period): number {
  if (period === "day") return user.day_count ?? 0
  if (period === "month") return user.month_count ?? 0
  return user.week_count ?? 0
}

export function Leaderboard() {
  const [period, setPeriod] = useState<Period>("week")
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`${API_URL}?period=${period}`, {
          headers: {
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        })

        if (!res.ok) {
          throw new Error(await res.text())
        }

        const json: LeaderboardData = await res.json()
        setData(json)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ошибка загрузки")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  const users = data?.items ?? []
  const topThree = users.slice(0, 3)
  const restUsers = users.slice(3)

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-20 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Топ чата
          </h1>
        </div>

        {/* Period tabs */}
        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
          {(["day", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Podium */}
          <div className="relative bg-card rounded-2xl p-6 mb-6">
            <div className="flex items-end justify-center gap-4 pt-8 pb-4">
              {topThree.map((user, index) => (
                <TopUser
                  key={user.user_id}
                  rank={index + 1}
                  firstName={user.first_name}
                  username={user.username}
                  avatar={user.avatar_url}
                  messageCount={getMessageCount(user, period)}
                  isTopThree
                />
              ))}
            </div>
          </div>

          {/* Rest */}
          {restUsers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4 px-1">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Остальные участники
                </span>
              </div>

              {restUsers.map((user, index) => (
                <TopUser
                  key={user.user_id}
                  rank={index + 4}
                  firstName={user.first_name}
                  username={user.username}
                  avatar={user.avatar_url}
                  messageCount={getMessageCount(user, period)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
