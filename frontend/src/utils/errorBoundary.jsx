// Create a new file: ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error);
        console.error('Error info:', errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
                    <h2 className="text-red-800 text-lg font-semibold mb-2">
                        Slider Error Caught!
                    </h2>
                    <details className="text-red-700">
                        <summary className="cursor-pointer mb-2 font-medium">
                            Click to see error details
                        </summary>
                        <div className="bg-red-100 p-3 rounded text-sm">
                            <p><strong>Error:</strong> {this.state.error?.toString()}</p>
                            <pre className="mt-2 overflow-auto max-h-40 whitespace-pre-wrap">
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </div>
                    </details>
                    <button 
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;