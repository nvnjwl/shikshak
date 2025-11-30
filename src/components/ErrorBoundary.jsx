import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/app';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                    <Card className="max-w-2xl w-full p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-red-600" size={40} />
                        </div>

                        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-text-secondary mb-6">
                            Don't worry! This happens sometimes. Try refreshing the page or going back to the dashboard.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left mb-6 bg-gray-50 p-4 rounded-lg">
                                <summary className="cursor-pointer font-bold text-sm text-gray-700 mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="text-xs text-red-600 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={this.handleReset}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Refresh Page
                            </Button>
                            <Button
                                onClick={this.handleGoHome}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Home size={18} />
                                Go to Dashboard
                            </Button>
                        </div>

                        <p className="text-xs text-text-secondary mt-6">
                            If this problem persists, please contact support at support@shikshak.com
                        </p>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
