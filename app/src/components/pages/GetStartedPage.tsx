import * as React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import {
  setAcceptedTermsPrivacy,
  useAcceptedTermsPrivacy,
} from '../../utils/store';

const GetStartedButton = styled.button`
  background-color: #9086d6;
  padding: 16px 32px;
  font-size: 26px;
  font-weight: 300;
  border-radius: 10px;
  color: white;
  border: none;
  cursor: pointer;
  font-family: Roboto;
  box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.25);
  outline: none;
  transition: background-color 200ms;
`;

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
    <div>
      <label htmlFor="accept-privacy-terms">
        <input
          type="checkbox"
          id="accept-privacy-terms"
          name="accept-privacy-terms"
          checked={isPrivacyChecked}
          onChange={(e) => {
            setIsPrivacyChecked(e.target.checked);
          }}
        />
        I have read and accept Left on Read&apos;s Privacy Policy
      </label>

      <GetStartedButton
        onClick={() => {
          setAcceptedTermsPrivacy(true);
        }}
        disabled={!isPrivacyChecked}
      >
        Continue
      </GetStartedButton>
    </div>
  );
}
