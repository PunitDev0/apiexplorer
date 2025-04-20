"use client";

import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthContext } from "@/context/AuthContext";
import { createWorkspace, Workspaces, WorkspacesbyId } from "@/services/workspace.service";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(100, "Name too long"),
});

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  // console.log(user);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    async function fetchWorkspaces() {
      setIsLoading(true);
      try {
        const response = await Workspaces();
        const formattedWorkspaces = response.data.map((workspace) => ({
          name: workspace.name || "Unnamed",
          lastUsed: workspace.updatedAt
            ? new Date(workspace.updatedAt).toLocaleString()
            : "N/A",
          requestCount: workspace.requestCount || 0,
          owner: workspace.owner?.name || "Unknown",
          _id: workspace._id,
        }));
        setWorkspaces(formattedWorkspaces);
      } catch (error) {
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to fetch workspaces",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchWorkspaces();
    }
  }, [ authLoading, router]);

  const handleOpenWorkspace = async (id) => {
    try {
      const workspaceData = await WorkspacesbyId(id);
      router.push(`/workspace/${id}`);
    } catch (error) {
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to open workspace",
      });
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    
    try {
      const response = await createWorkspace(data.name, user._id);
      console.log(response);
      
      const newWorkspace = {
        name: response.data.name,
        lastUsed: new Date(response.data.createdAt).toLocaleString(),
        requestCount: 0,
        owner: user.name || "Unknown",
        _id: response.data._id,
      };
      setWorkspaces((prev) => [...prev, newWorkspace]);
      addToast({
        variant: "success",
        title: "Success",
        description: "Workspace created successfully",
      });
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      addToast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to create workspace",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWorkspaces = workspaces.filter(
    (workspace) =>
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workspace.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedWorkspaces = [...filteredWorkspaces].sort((a, b) => {
    if (sortOption === "name") return a.name.localeCompare(b.name);
    if (sortOption === "lastUsed")
      return new Date(b.lastUsed) - new Date(a.lastUsed);
    if (sortOption === "requestCount") return b.requestCount - a.requestCount;
    return 0;
  });

  if (authLoading || isLoading) {
    return <div className="min-h-screen bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto p-6">
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-accent mb-2">
            Your Workspaces
          </h2>

          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search by name or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xs p-2 bg-black text-white rounded border border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 bg-black text-white rounded border border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="name">Sort by Name</option>
              <option value="lastUsed">Sort by Last Used</option>
              <option value="requestCount">Sort by Requests</option>
            </select>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/80 transition duration-200">
                  Add Workspace
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black text-white border border-accent">
                <DialogHeader className="text-primary">
                  <DialogTitle>Create New Workspace</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new workspace.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="py-4">
                    <Input
                      type="text"
                      placeholder="Workspace Name"
                      {...register("name")}
                      className="w-full bg-black text-white border border-accent focus:ring-2 focus:ring-accent"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-black text-white border border-accent hover:bg-accent/20"
                        onClick={() => reset()}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-accent text-white hover:bg-accent/80 disabled:bg-accent/50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <div className="overflow-x-auto">
          <Table className="w-full text-white">
            <TableCaption className="text-primary">
              List of your workspaces.
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-black text-primary">
                <TableHead className="text-primary">Name</TableHead>
                <TableHead className="text-primary">Owner</TableHead>
                <TableHead className="text-primary">Last Used</TableHead>
                <TableHead className="text-primary">Requests</TableHead>
                <TableHead className="text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedWorkspaces.length > 0 ? (
                sortedWorkspaces.map((workspace) => (
                  <TableRow
                    key={workspace._id}
                    className="hover:bg-black/50 transition duration-200"
                  >
                    <TableCell className="font-medium">{workspace.name}</TableCell>
                    <TableCell>{workspace.owner}</TableCell>
                    <TableCell>{workspace.lastUsed}</TableCell>
                    <TableCell>{workspace.requestCount}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleOpenWorkspace(workspace._id)}
                        className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/80 transition duration-200"
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-accent">
                    No workspaces found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}