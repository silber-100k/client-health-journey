"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FileText, Eye, FolderOpen } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import GoogleDocViewer from "@/app/components/check-ins/form/resourceTabs/GoogleDocViewer";
import TextComponent from "../check-ins/form/resourceTabs/TextComponent";

const ClientResources = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAllTexts = async () => {
    try {
      setIsLoading(true);
      const responsse = await fetch("/api/admin/resource/html");
      const responseData = await responsse.json();
      if (responseData.status) {
        setResources(responseData.texts);
        setIsLoading(false);
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllTexts();
  }, []);

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-4 w-full max-w-5xl mx-auto">
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <FileText size={20} className="text-primary" />
            Resources & Documents
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Documents and resources shared by your coach
          </CardDescription>
        </CardHeader>

        <CardContent className="px-2 sm:px-4">
          {isLoading ? (
            <div className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                    <Skeleton className="h-5 w-32" />
                    <div className="flex space-x-4">
                      <Skeleton className="h-5 w-8" />
                      <Skeleton className="h-5 w-8" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 w-full flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <TabsTrigger value="all" className="w-full sm:w-auto">All</TabsTrigger>
                  <TabsTrigger value="guides" className="w-full sm:w-auto">Guides</TabsTrigger>
                  <TabsTrigger value="nutrition" className="w-full sm:w-auto">Nutrition</TabsTrigger>
                  <TabsTrigger value="protocols" className="w-full sm:w-auto">Protocols</TabsTrigger>
                  <TabsTrigger value="wellness" className="w-full sm:w-auto">Wellness</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {resources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onClick={() => setSelectedResource(resource)}
                      />
                    ))}
                  </div>
                </TabsContent>

                {["guides", "nutrition", "protocols", "wellness"].map(
                  (category) => (
                    <TabsContent key={category} value={category}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {resources
                          .filter((r) => r.category === category)
                          .map((resource) => (
                            <ResourceCard
                              key={resource.id}
                              resource={resource}
                              onClick={() => setSelectedResource(resource)}
                            />
                          ))}
                      </div>
                    </TabsContent>
                  )
                )}
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
      {selectedResource && (
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{selectedResource.title}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Uploaded on{" "}
              {selectedResource.uploadDate
                ? format(selectedResource.uploadDate, "MMMM d, yyyy")
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-4">
            {selectedResource.type === "Doc" ? (
              <GoogleDocViewer selectedResource={selectedResource} />
            ) : (
              <TextComponent text={selectedResource} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ResourceCard = ({ resource, onClick }) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow w-full max-w-full"
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
          <div className="p-2 bg-primary/10 rounded-lg mb-2 sm:mb-0">
            <FileText className="text-primary h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm sm:text-base">{resource.title}</h3>
              {resource.isNew && (
                <Badge variant="secondary" className="h-5 text-xs">
                  New
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
              {resource.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientResources;
