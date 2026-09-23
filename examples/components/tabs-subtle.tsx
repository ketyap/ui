"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabsSubtleDemo = () => (
  <Tabs variant="subtle" defaultValue="overview">
    <TabsList aria-label="subtle navigation">
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
);
