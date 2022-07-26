import { ChakraProvider } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';

export function TestComponent() {
  return <div />;
}

export function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" />
        <Route path="/dashboard" element={<TestComponent />} />
      </Routes>
    </ChakraProvider>
  );
}
