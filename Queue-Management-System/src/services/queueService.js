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

    /**
     * จองคิวใหม่
     * @param {number} userId - ID ของผู้ใช้งาน
     * @param {number} tableId - ID ของโต๊ะที่เลือก
     * @param {number} personCount - จำนวนลูกค้า
     * @param {string} date - วันที่จากหน้าจอ (เช่น "2026-03-29")
     * @param {string} time - เวลาจากหน้าจอ (เช่น "16:41" หรือ "04:41 PM")
     */
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

    // ตัวอย่างฟังก์ชันใน queueService.js
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

    /**
     * อัปเดตสถานะคิว
     * @param {number} queueId - ID ของคิว
     * @param {number} statusId - ID สถานะใหม่ (1: reserved, 2: skipped, 3: completed)
     */
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

    // เรียกใช้เมื่อลูกค้ามาถึง
    arrive: async (queueId) => {
        const response = await api.post('/queue.php/arrive', { queue_id: queueId });
        return response.data;
    },

    // เรียกใช้เมื่อบริการเสร็จสิ้น
    complete: async (queueId) => {
        const response = await api.post('/queue.php/complete', { queue_id: queueId });
        return response.data;
    },

    skip: async (queueId) => {
        const response = await api.post('/queue.php/skip', { queue_id: queueId });
        return response.data;
    },

    /**
     * ลบคิวออกจากระบบ
     * @param {number} queueId - ID ของคิวที่ต้องการลบ
     */
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