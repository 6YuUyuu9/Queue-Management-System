import api from '../api/axiosConfig';

export const queueService = {

    getAll: async () => {
        try {
            const response = await api.get('/queue.php/list');
            return response.data;
        } catch (error) {
            console.error("Error fetching queues:", error);
            throw error;
        }
    },

    add: async (userId, tableId, personCount, date, time) => {
        try {
            console.log('add params:', { userId, tableId, personCount, date, time })
            const response = await api.post('/queue.php/add', {
                user_id: userId,
                table_id: tableId,
                person_count: personCount,
                date: date,
                time: time
            });
            return response.data;
        } catch (error) {
            console.error("Error adding queue:", error);
            throw error;
        }
    },

    update: async (queueId, tableId, personCount) => {
        try {
            const response = await api.post('/queue.php/update', {
                queue_id: queueId,
                table_id: tableId,
                person_count: personCount
            });
            return response.data;
        } catch (error) {
            console.error("Error updating queue:", error);
            throw error;
        }
    },

    updateStatus: async (queueId, statusId) => {
        try {
            const response = await api.post('/queue.php/update-status', {
                queue_id: queueId,
                status_id: statusId
            });
            return response.data;
        } catch (error) {
            console.error("Error updating queue status:", error);
            throw error;
        }
    },

    arrive: async (queueId) => {
        const response = await api.post('/queue.php/arrive', { queue_id: queueId });
        return response.data;
    },

    complete: async (queueId) => {
        const response = await api.post('/queue.php/complete', { queue_id: queueId });
        return response.data;
    },

    skip: async (queueId) => {
        const response = await api.post('/queue.php/skip', { queue_id: queueId });
        return response.data;
    },

    delete: async (queueId) => {
        try {
            const response = await api.post('/queue.php/delete', {
                queue_id: queueId
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting queue:", error);
            throw error;
        }
    },

    findTable: async (date, arriveTime, personCount) => {
        try {
            const response = await api.post('/queue.php/find-table', {
                date: date,
                arrive_time: arriveTime,
                person_count: personCount
            });
            return response.data;
        } catch (error) {
            console.error("Error finding table:", error);
            throw error;
        }
    },

    getSummary: async (date = null) => {
    try {
        const today = new Date()
        const localDate = date ?? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
        const response = await api.get(`/queue.php/summary?date=${localDate}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching summary:", error);
        throw error;
    }
}

};