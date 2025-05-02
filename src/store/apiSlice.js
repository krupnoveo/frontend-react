import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:9090',
    }),
    tagTypes: ['Records', 'Profile', 'Users', 'Barbershops', 'Services'],
    endpoints: (builder) => ({
        getServices: builder.query({
            query: () => ('/service/all'),
            providesTags: ['Services'],
        }),
        getBarbershops: builder.query({
            query: () => ('/barbershop/all'),
            providesTags: ['Barbershops'],
        }),
        signUp: builder.mutation({
            query: (credentials) => ({
                url: '/auth/signup',
                method: 'POST',
                body: credentials,
            }),
        }),
        signIn: builder.mutation({
            query: (credentials) => ({
                url: '/auth/signin',
                method: 'POST',
                body: credentials,
            }),
        }),
        getProfile: builder.query({
            query: () => ({
                url: '/me',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/me/update/data',
                method: 'PUT',
                body: data,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Profile'],
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: '/me/update/password',
                method: 'PUT',
                body: data,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
        }),
        getRecords: builder.query({
            query: () => ({
                url: '/record/all',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            providesTags: ['Records'],
        }),
        getBarbershopRecords: builder.query({
            query: (barbershopId) => ({
                url: `/record/all?barbershopId=${barbershopId}`,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            providesTags: ['Records'],
        }),
        getRecordById: builder.query({
            query: (recordId) => ({
                url: `/record/${recordId}`,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            providesTags: (result, error, id) => [{ type: 'Records', id }],
        }),
        getClientById: builder.query({
            query: (clientId) => ({
                url: `/me/${clientId}`,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
        }),
        getBarbers: builder.query({
            query: (barbershopId) => ({
                url: `/me/all?barbershopId=${barbershopId}&role=BARBER`,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            providesTags: ['Users'],
        }),
        getClients: builder.query({
            query: () => ({
                url: `/me/all?role=CLIENT`,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            providesTags: ['Users'],
        }),
        getAvailableTimes: builder.query({
            query: (barberId) => ({
                url: `/available_time/all?barberId=${barberId}`,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
        }),
        createRecord: builder.mutation({
            query: (recordData) => ({
                url: '/record/new',
                method: 'POST',
                body: recordData,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Records'],
        }),
        updateRecordTime: builder.mutation({
            query: ({recordId, timeId}) => ({
                url: `/record/${recordId}/update`,
                method: 'PUT',
                body: { time_id: timeId },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Records'],
        }),
        cancelRecord: builder.mutation({
            query: (recordId) => ({
                url: `/record/${recordId}/delete`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Records'],
        }),
        
        // Admin API методы
        getAllUsers: builder.query({
            query: (params = {}) => {
                let url = '/me/all';
                const queryParams = [];
                
                if (params.role) {
                    queryParams.push(`role=${params.role}`);
                }
                
                if (params.barbershopId) {
                    queryParams.push(`barbershopId=${params.barbershopId}`);
                }
                
                if (queryParams.length) {
                    url += `?${queryParams.join('&')}`;
                }
                
                return {
                    url,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                };
            },
            providesTags: ['Users'],
        }),
        getUserById: builder.query({
            query: (userId) => ({
                url: `/me/${userId}`,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/me/${userId}/delete`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Users'],
        }),
        updateUser: builder.mutation({
            query: ({userId, userData}) => ({
                url: `/me/${userId}/update/data`,
                method: 'PUT',
                body: userData,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Users'],
        }),
        changeUserPassword: builder.mutation({
            query: ({userId, passwordData}) => ({
                url: `/me/${userId}/update/password`,
                method: 'PUT',
                body: passwordData,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
        }),
        createBarber: builder.mutation({
            query: (barberData) => ({
                url: '/auth/barber/signup',
                method: 'POST',
                body: barberData,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Users'],
        }),
        createAdministrator: builder.mutation({
            query: (adminData) => ({
                url: '/auth/administrator/signup',
                method: 'POST',
                body: adminData,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Users'],
        }),
        updateUserPhoto: builder.mutation({
            query: ({userId, photoFile}) => {
                const formData = new FormData();
                formData.append('photo', photoFile);
                
                return {
                    url: `/me/${userId}/update/photo`,
                    method: 'POST',
                    body: formData,
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    formData: true,
                };
            },
            invalidatesTags: ['Users'],
        }),
        deleteUserPhoto: builder.mutation({
            query: (userId) => ({
                url: `/me/${userId}/photo/delete`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Users'],
        }),
        createBarbershop: builder.mutation({
            query: (barbershopData) => ({
                url: '/barbershop/new',
                method: 'POST',
                body: barbershopData,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Barbershops'],
        }),
        updateBarbershop: builder.mutation({
            query: ({barbershopId, barbershopData}) => ({
                url: `/barbershop/${barbershopId}/update`,
                method: 'POST',
                body: barbershopData,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Barbershops'],
        }),
        deleteBarbershop: builder.mutation({
            query: (barbershopId) => ({
                url: `/barbershop/${barbershopId}/delete`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Barbershops'],
        }),
        updateBarbershopPhoto: builder.mutation({
            query: ({barbershopId, photoFile}) => {
                const formData = new FormData();
                formData.append('photo', photoFile);
                
                return {
                    url: `/barbershop/${barbershopId}/update/photo`,
                    method: 'POST',
                    body: formData,
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    formData: true,
                };
            },
            invalidatesTags: ['Barbershops'],
        }),
        deleteBarbershopPhoto: builder.mutation({
            query: (barbershopId) => ({
                url: `/barbershop/${barbershopId}/photo/delete`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Barbershops'],
        }),
        createService: builder.mutation({
            query: (serviceData) => ({
                url: '/service/new',
                method: 'POST',
                body: serviceData,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Services'],
        }),
        updateService: builder.mutation({
            query: ({serviceId, serviceData}) => ({
                url: `/service/${serviceId}/update`,
                method: 'POST',
                body: serviceData,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Services'],
        }),
        deleteService: builder.mutation({
            query: (serviceId) => ({
                url: `/service/${serviceId}/delete`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: ['Services'],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useGetBarbershopsQuery,
    useSignUpMutation,
    useSignInMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useGetRecordsQuery,
    useGetBarbershopRecordsQuery,
    useGetRecordByIdQuery,
    useGetClientByIdQuery,
    useGetBarbersQuery,
    useGetClientsQuery,
    useGetAvailableTimesQuery,
    useCreateRecordMutation,
    useUpdateRecordTimeMutation,
    useCancelRecordMutation,
    
    // Admin hooks
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useChangeUserPasswordMutation,
    useCreateBarberMutation,
    useCreateAdministratorMutation,
    useUpdateUserPhotoMutation,
    useDeleteUserPhotoMutation,
    useCreateBarbershopMutation,
    useUpdateBarbershopMutation,
    useDeleteBarbershopMutation,
    useUpdateBarbershopPhotoMutation,
    useDeleteBarbershopPhotoMutation,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = apiSlice;