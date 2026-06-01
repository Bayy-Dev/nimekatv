import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import Dashboard from "@/pages/Dashboard";
import SearchPage from "@/pages/Search";
import Ongoing from "@/pages/Ongoing";
import Complete from "@/pages/Complete";
import AnimeDetail from "@/pages/AnimeDetail";
import WatchPage from "@/pages/Watch";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <>
      <Navbar />
      <main className="pb-20 sm:pb-0">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/ongoing" component={Ongoing} />
          <Route path="/complete" component={Complete} />
          <Route path="/search" component={SearchPage} />
          <Route path="/anime/:animeId" component={AnimeDetail} />
          <Route path="/watch/:episodeId" component={WatchPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-background text-foreground">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
