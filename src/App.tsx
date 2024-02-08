import React from 'react';
import AppRouter from './router/AppRouter';
import { Provider } from 'react-redux';
import authStore from './stores/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={authStore}>
                <AppRouter />
            </Provider>
        </QueryClientProvider>
    )
}
