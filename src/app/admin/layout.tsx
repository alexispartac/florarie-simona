
import { MantineProvider } from '@mantine/core';
import { UserProvider } from "../components/ContextUser";
import '@mantine/core/styles.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MantineProvider>
        <UserProvider>
            {children}
        </UserProvider>
    </MantineProvider>
  );
}


