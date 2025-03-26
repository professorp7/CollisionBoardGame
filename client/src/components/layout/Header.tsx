import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "../../contexts/AppContext";

export function Header() {
  const { characters, teams } = useAppContext();
  const { toast } = useToast();
  
  const handleSaveAll = () => {
    // Data is already saved through context effects,
    // so this is just a confirmation for the user
    toast({
      title: "Data Saved",
      description: `Saved ${characters.length} characters and ${teams.length} teams.`,
    });
  };
  
  return (
    <header className="flex items-center justify-between py-4 mb-6">
      <h1 className="text-3xl font-heading font-bold text-primary">Battle Companion</h1>
      <div>
        <Button 
          variant="secondary" 
          className="mr-2"
          onClick={handleSaveAll}
        >
          <i className="fas fa-save mr-2"></i>Save All
        </Button>
        <Button variant="outline" size="icon">
          <i className="fas fa-cog"></i>
        </Button>
      </div>
    </header>
  );
}
