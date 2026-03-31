import api from '../api/axiosConfig';

export const tableService = {
    list: async () => {
        const response = await api.get('/table.php/list');
        return response.data;
    },

    getTypes: async () => {
        try {
            const response = await api.get('/table.php/types');
            return response.data;
        } catch (error) {
            console.error("Error fetching table types:", error);
            throw error;
        }
    },

    add: async (tableName, typeId) => {
        const response = await api.post('/table.php/add', {
            table_name: tableName,
            type_id: typeId
        });
        return response.data;
    },

    update: async (tableId, tableName, typeId) => {
        const response = await api.post('/table.php/update', {
            table_id: tableId,
            table_name: tableName,
            type_id: typeId
        });
        return response.data;
    },
    delete: async (tableId) => {
        const response = await api.post('/table.php/delete', {
            table_id: tableId
        });
        return response.data;
    }
};