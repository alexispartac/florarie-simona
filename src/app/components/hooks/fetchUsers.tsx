'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const URL_USERS = '/api/users';

const fetchUsers = async () => {
    const response = await axios.get(URL_USERS);
    return response.data;
}

export const useUsers = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: fetchUsers,
    });
};