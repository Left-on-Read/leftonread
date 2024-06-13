import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const initialBotMessage: Message = {
  text: 'Hi there :) You can ask me questions here about your iMessages! For example, try "Who is my best friend?"',
  sender: 'bot',
};

interface ChatInterfaceProps {
  openAIKey: string;
}

export function ChatInterface(props: ChatInterfaceProps) {
  const { openAIKey } = props;

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [newMessage, setNewMessage] = useState<string>('');

  const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
      setAwaitingResponse(true);

      const llmResponse: string = await ipcRenderer.invoke(
        'rag-engine',
        newMessage,
        openAIKey
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: llmResponse, sender: 'bot' },
      ]);
      setAwaitingResponse(false);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
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
