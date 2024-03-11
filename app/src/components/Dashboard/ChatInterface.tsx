import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { waitFor } from '@testing-library/react';
import { TRAGEngineResults } from 'analysis/queries/RagEngine';
import { ipcRenderer } from 'electron';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const initialBotMessage =
  'Hi there :) For now you can type in a contact name to see how many messages have been sent between you!';
// 'Hi there :) You can ask me questions here about your iMessages!'; // For example, try "What should I get mom for her birthday?"';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [newMessage, setNewMessage] = useState<string>('');
  const [response, setResponse] = useState<string>(initialBotMessage);

  const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);

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

      // To replace with a query to the DB
      const llmResponse: TRAGEngineResults = await ipcRenderer.invoke(
        'rag-engine',
        newMessage
      );
      // setResponse(llmResponse);
      console.log(llmResponse[0].message_count);
      setResponse(llmResponse[0].message_count);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // call llamaindex, receive response
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: response, sender: 'bot' },
    ]);
    setAwaitingResponse(false);
  }, [response]);

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
