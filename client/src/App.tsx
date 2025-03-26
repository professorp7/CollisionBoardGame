import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "./contexts/AppContext";
import AppLayout from "./components/layout/AppLayout";
import CharacterPage from "./pages/CharacterPage";
import TeamPage from "./pages/TeamPage";
import BattlePage from "./pages/BattlePage";
import DicePage from "./pages/DicePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CharacterPage} />
      <Route path="/characters" component={CharacterPage} />
      <Route path="/teams" component={TeamPage} />
      <Route path="/battle" component={BattlePage} />
      <Route path="/dice" component={DicePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppLayout>
          <Router />
        </AppLayout>
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
