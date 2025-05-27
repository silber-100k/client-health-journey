"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { FileText, Video, BookOpen } from "lucide-react";
import { useState } from "react";
import VideoTab from "@/app/components/check-ins/form/resourceTabs/VideoTab"
import TutorialTab from "@/app/components/check-ins/form/resourceTabs/TutorialTab"
import DocumentTab from "@/app/components/check-ins/form/resourceTabs/DocumentTab"
import { Tabs,TabsList,TabsTrigger,TabsContent } from "@/app/components/ui/tabs";

const ResourcesPage = () => {
 
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <p className="text-gray-500">
          Training materials and resources for clinics and coaches
        </p>
      </div>

 <Tabs defaultValue="video">
          <TabsList className="mt-6 mb-6 w-full flex">
            <TabsTrigger value="video" className="flex-1">
              Training Videos &nbsp; <Video size={20} className="text-blue-500" />
            </TabsTrigger>
            <TabsTrigger value="document" className="flex-1">
              Documents & Forms &nbsp; <FileText size={20} className="text-green-500" />
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="flex-1">
              Tutorials & Guides &nbsp; <BookOpen size={20} className="text-amber-500" />
            </TabsTrigger>
          </TabsList>
              <TabsContent value="video">
                <VideoTab/>
              </TabsContent>
              <TabsContent value="document">
                <DocumentTab/>
              </TabsContent>
              <TabsContent value="tutorial">
                <TutorialTab/>
              </TabsContent>
            </Tabs>


      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            This section will contain training materials, guides, and resources
            for clinics and coaches. Upload videos, documents, and other
            training content to help your network succeed. Content management
            features coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesPage;
