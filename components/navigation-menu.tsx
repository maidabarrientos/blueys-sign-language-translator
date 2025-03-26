import { Heart, Info, History } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NavigationMenu() {
  return (
    <div className="mt-4 space-y-2">
      <Button variant="ghost" className="w-full justify-start" asChild>
        <a href="/about">
          <Info className="mr-2 h-4 w-4" />
          About
        </a>
      </Button>
      <Button variant="ghost" className="w-full justify-start" asChild>
        <a href="/help">
          <Heart className="mr-2 h-4 w-4" />
          How You Can Help
        </a>
      </Button>
      <Button variant="ghost" className="w-full justify-start" asChild>
        <a href="/changelog">
          <History className="mr-2 h-4 w-4" />
          Changelog
        </a>
      </Button>
    </div>
  )
} 