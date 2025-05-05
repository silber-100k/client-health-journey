
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import ProgramOverviewTab from '../../components/programs/tabs/ProgramOverviewTab';
import GuidelinesTab from '../../components/programs/tabs/GuidelinesTab';
import SupplementsTab from '../../components/programs/tabs/SupplementsTab';

const ProgramDetailsContent = () => {
  const loading = false;
  const programType = "practice_naturals";
  const programCategory = "B"
  const supplements = [
    {
      id:"1",
      name:"aaa",
      description:"adsfasdfasdf",
      dosage:23,
      frequency:3,
      timeofDay:3,
    },
    {
      id:"2",
      name:"aaaddf",
      description:"adfdfdsfasdfasdf",
      dosage:21,
      frequency:4,
      timeofDay:2,
    },
  ]
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="supplements">Supplements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ProgramOverviewTab />
        </TabsContent>
        
        <TabsContent value="guidelines">
          <GuidelinesTab 
            loading={loading} 
            programType={programType} 
            programCategory={programCategory} 
          />
        </TabsContent>
        
        <TabsContent value="supplements">
          <SupplementsTab 
            supplements={supplements} 
            programType={programType} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgramDetailsContent;
