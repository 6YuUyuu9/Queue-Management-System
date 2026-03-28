import api from '../api/axiosConfig';

export const queueService = {
    /**
     * ดึงรายการคิวทั้งหมด 
     * (จะได้รับข้อมูลที่มี Join ชื่อ User และชื่อโต๊ะมาเรียบร้อยแล้ว)
     */
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
     */
    add: async (userId, tableId, personCount) => {
        try {
            const response = await api.post('/queue.php/add', {
                user_id: userId,
                table_id: tableId,
                person_count: personCount
            });
            return response.data;
        } catch (error) {
            console.error("Error adding queue:", error);
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
    }
};