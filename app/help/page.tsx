import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function HelpPage() {
  return (
    <main className="container mx-auto p-4">
      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle>How You Can Help</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-blue">
          <div className="grid gap-6">
            <section>
              <h2>Support the Project</h2>
              {/* Add funding options */}
            </section>
            <section>
              <h2>Contact the Developer</h2>
              {/* Add contact form */}
            </section>
          </div>
        </CardContent>
      </Card>
    </main>
  )
} 