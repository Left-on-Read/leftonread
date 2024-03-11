import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { waitFor } from '@testing-library/react';
import { ipcRenderer } from 'electron';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const testMessage: Message = {
  text: 'Hi there :) You can ask me questions here about your iMessages! For example, try "What should I get mom for her birthday?"',
  sender: 'bot',
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([testMessage]);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
      // Add logic to handle sending the message to the recipient
      setAwaitingResponse(true);
    }

    // To replace with a query to the DB
    const toLog = await ipcRenderer.invoke('print-tables');
    console.log(toLog);
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
    if (messages[messages.length - 1].sender === 'user') {
      // call llamaindex, receive response
      const handleResponseMessage = (response: string) => {
        setMessages([...messages, { text: response, sender: 'bot' }]);
        setAwaitingResponse(false);
      };
      handleResponseMessage('Sample Response');
    }
  }, [messages]);

  return (
    <Box width="90%" mx="auto" mt={8}>
      <Box
        ref={messagesContainerRef}
        bg="gray.100"
        p={4}
        borderRadius="md"
        height="inherit"
        maxH="70vh"
        minH="70vh"
        overflowY="scroll"
        display="flex"
        flexDirection="column"
      >
        {messages.map((message, index) => (
          <Flex
            key={index}
            mb={2}
            alignItems="flex-end"
            justifyContent={
              message.sender === 'user' ? 'flex-end' : 'flex-start'
            }
          >
            <Box
              bg={message.sender === 'user' ? 'blue.500' : 'gray.300'}
              color={message.sender === 'user' ? 'white' : 'black'}
              p={2}
              borderRadius="md"
              maxW="80%"
            >
              <Text>{message.text}</Text>
            </Box>
          </Flex>
        ))}
      </Box>
      <Flex mt={4}>
        <Input
          value={newMessage}
          onChange={handleMessageChange}
          placeholder="Type your message..."
          mr={2}
        />
        <Button
          colorScheme="purple"
          onClick={handleSendMessage}
          isLoading={awaitingResponse}
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
}

export default ChatInterface;
