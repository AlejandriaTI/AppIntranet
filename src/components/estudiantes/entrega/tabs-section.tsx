import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

interface TabsSectionProps {
  tabs: Array<{
    id: string
    label: string
    content: React.ReactNode
  }>
  defaultTab?: string
}

export function TabsSection({ tabs, defaultTab }: TabsSectionProps) {
  return (
    <Card className="p-6">
      <Tabs defaultValue={defaultTab || tabs[0]?.id} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}
