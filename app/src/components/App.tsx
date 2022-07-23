import { ChakraProvider } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';

export function TestComponent() {
  return <div />;
}

export default function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" />
        <Route path="/access" element={<TestComponent />} />
        <Route path="/dashboard" element={<TestComponent />} />
      </Routes>
    </ChakraProvider>
  );
}
