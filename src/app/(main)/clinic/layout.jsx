import { ClinicProvider } from "@/app/context/ClinicContext";

const Layout = ({ children }) => {
    return (
        <ClinicProvider>
            {children}
        </ClinicProvider>
    );
};

export default Layout;
