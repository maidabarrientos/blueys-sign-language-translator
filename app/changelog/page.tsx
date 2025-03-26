import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ChangelogPage() {
  return (
    <main className="container mx-auto p-4">
      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle>Development Changelog</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-blue">
          <div className="space-y-8">
            {/* Add changelog entries */}
          </div>
        </CardContent>
      </Card>
    </main>
  )
} 