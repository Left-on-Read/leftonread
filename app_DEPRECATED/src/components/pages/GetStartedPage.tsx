import { Button, Checkbox, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import {
  setAcceptedTermsPrivacy,
  useAcceptedTermsPrivacy,
} from '../../utils/store';

export function GetStartedPage() {
  const history = useHistory();

  const hasAccepted = useAcceptedTermsPrivacy();
  const [isPrivacyChecked, setIsPrivacyChecked] = React.useState<boolean>(
    false
  );

  React.useEffect(() => {
    if (hasAccepted) {
      history.push('/access');
    }
  }, [history, hasAccepted]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex' }}>
          <Checkbox
            isChecked={isPrivacyChecked}
            onChange={(e) => {
              setIsPrivacyChecked(e.target.checked);
            }}
          />
          <Text fontSize="lg">
            I have read and accept Left on Read&apos;s Privacy Policy
          </Text>
        </div>
        <Button
          onClick={() => {
            setAcceptedTermsPrivacy(true);
          }}
          disabled={!isPrivacyChecked}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
