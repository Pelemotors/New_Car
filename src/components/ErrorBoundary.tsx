import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-dark mb-2">אופס! משהו השתבש</h1>
              <p className="text-darkGray mb-4">
                אירעה שגיאה בלתי צפויה. אנא רענן את הדף ונסה שוב.
              </p>
              {this.state.error && (
                <details className="text-right mb-4">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    פרטים טכניים
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-right overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              רענן דף
            </button>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                אם הבעיה נמשכת, אנא צור קשר:
                <br />
                <a href="tel:04-994-9994" className="text-primary hover:underline">
                  04-994-9994
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

