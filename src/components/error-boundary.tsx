import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Text, Button } from 'zmp-ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box className="flex flex-col items-center justify-center p-4 space-y-4">
          <Text className="text-red-500 font-medium">Đã xảy ra lỗi</Text>
          <Text size="small" className="text-gray text-center">
            {this.state.error?.message || 'Có lỗi xảy ra trong ứng dụng'}
          </Text>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }}
            variant="primary"
          >
            Thử lại
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
