import log from 'electron-log';
import React, { Component, ErrorInfo } from 'react';

import { ErrorPage } from './Support/ErrorPage';

interface Props {
  children?: React.ReactNode;
  onRefresh: () => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    log.error(error);
    log.error(errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          onRefresh={this.props.onRefresh}
          onClearError={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}
