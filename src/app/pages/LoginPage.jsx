import DemoLoginButtons from "../auth/signup/DemoLoginButtons";
import LoginFormFields from "../auth/signup/LoginFormFields";
import LoginHeader from "../auth/signup/LoginHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <LoginHeader />
          <Tabs defaultValue="Login" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Register Your Clinic</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <LoginFormFields />
            </TabsContent>
            <DemoLoginButtons/>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
