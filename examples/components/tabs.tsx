"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SizeProvider } from "@/lib/size-context";

export const TabsDemo = () => (
  <div className="flex flex-col gap-6">
    <Tabs variant="default" defaultValue="overview">
      <TabsList aria-label="default navigation">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Your overview.</TabsContent>
      <TabsContent value="activity">Recent activity.</TabsContent>
      <TabsContent value="settings">Project settings.</TabsContent>
    </Tabs>
    <SizeProvider size="compact">
      <Tabs defaultValue="one">
        <TabsList aria-label="Compact navigation">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>
    </SizeProvider>
  </div>
);
