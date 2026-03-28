import api from '../api/axiosConfig';

export const tableService = {
    list: async () => {
        const response = await api.get('/table.php/list');
        return response.data;
    },
    add: async (tableName, typeId) => {
        const response = await api.post('/table.php/add', { 
            table_name: tableName, 
            type_id: typeId 
        });
        return response.data;
    }
};