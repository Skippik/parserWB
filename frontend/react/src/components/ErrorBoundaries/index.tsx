import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Flex, Result } from 'antd';

interface Props {
  children?: ReactNode;
  errorTitle?: string;
  btnTitle?: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Flex justify="center" align="center" vertical>
          <Result
            status="500"
            title="500"
            subTitle={'מהשהו לא בסדר, נא לרענן  את הדף'}
            extra={
              <Button
                onClick={() => {
                  window.location.href = '/';
                }}
                type="primary"
              >
                לרענן את הדף
              </Button>
            }
          />
        </Flex>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
