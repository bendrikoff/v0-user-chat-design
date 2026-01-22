"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Crown, Medal } from "lucide-react"

interface TopUserProps {
  rank: number
  firstName: string
  username?: string
  messageCount: number
  isTopThree?: boolean
  avatar?: string | null
}

export function TopUser({
  rank,
  firstName,
  username,
  messageCount,
  isTopThree = false,
  avatar,
}: TopUserProps) {
  const displayName = firstName || username || "User"

  const getRankStyle = () => {
    switch (rank) {
      case 1:
        return {
          size: "h-24 w-24",
          ring: "ring-4 ring-gold",
          badge: "bg-gold text-background",
          glow: "shadow-[0_0_30px_rgba(255,215,0,0.4)]",
        }
      case 2:
        return {
          size: "h-18 w-18",
          ring: "ring-3 ring-silver",
          badge: "bg-silver text-background",
          glow: "shadow-[0_0_20px_rgba(192,192,192,0.3)]",
        }
      case 3:
        return {
          size: "h-18 w-18",
          ring: "ring-3 ring-bronze",
          badge: "bg-bronze text-background",
          glow: "shadow-[0_0_20px_rgba(205,127,50,0.3)]",
        }
      default:
        return {
          size: "h-12 w-12",
          ring: "",
          badge: "bg-muted text-muted-foreground",
          glow: "",
        }
    }
  }

  const style = getRankStyle()

  if (isTopThree) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-2",
          rank === 1 ? "-mt-6" : "mt-4"
        )}
      >
        <div className="relative">
          {rank === 1 && (
            <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 h-8 w-8 text-gold fill-gold animate-pulse" />
          )}

          <Avatar
            className={cn(
              style.size,
              style.ring,
              style.glow,
              "transition-all duration-300"
            )}
          >
            {avatar && <AvatarImage src={avatar || "/placeholder.svg"} alt={displayName} />}
            <AvatarFallback className="bg-secondary text-secondary-foreground text-lg font-bold">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div
            className={cn(
              "absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold",
              style.badge
            )}
          >
            {rank}
          </div>
        </div>

        <div className="text-center mt-2">
          <p className="font-semibold text-foreground text-sm truncate max-w-20">
            {displayName}
          </p>
          <p className="text-xs text-muted-foreground">
            {messageCount.toLocaleString()} сообщ.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-card hover:bg-secondary/50 transition-colors duration-200">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold text-sm">
        {rank}
      </div>

      <Avatar className="h-12 w-12 ring-2 ring-border">
        {avatar && <AvatarImage src={avatar || "/placeholder.svg"} alt={displayName} />}
        <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
          {displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{displayName}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Medal className="h-3.5 w-3.5" />
          <span>{messageCount.toLocaleString()} сообщений</span>
        </div>
      </div>
    </div>
  )
}
