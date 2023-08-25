import { Box, Button } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { useState } from 'react';

export function AIPage() {
  const [fineTuneResults, setFineTuneResults] = useState<any>([]);

  const handleButtonClick = async () => {
    const results = await ipcRenderer.invoke('fine-tune-contact');
    setFineTuneResults(results);
  };

  return (
    <Box style={{ padding: '70px 36px 36px 36px' }}>
      <div>Fine Tune Your Contact</div>
      <Button onClick={handleButtonClick}>Run Finetune</Button>
      {fineTuneResults && JSON.stringify(fineTuneResults)}
    </Box>
  );
}
