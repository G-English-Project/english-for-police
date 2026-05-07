import type {
  StudentProgressSummary,
  StudentDossier,
} from "@/models/admin.model";

export const adminService = {
  getStudentList: async (): Promise<StudentProgressSummary[]> => {
    // Mocking API call
    return [
      {
        userId: 1,
        fullName: "SGT. MARCUS THORNE",
        rank: "OFFICER",
        email: "marcus.thorne@police.gov",
        completionPercentage: 85,
        lastActive: "2 giờ trước",
        role: "OFFICER",
      },
      {
        userId: 2,
        fullName: "CADET-OFFICER KHAN",
        rank: "CADET",
        email: "khan@police.gov",
        completionPercentage: 92,
        lastActive: "15 phút trước",
        role: "CADET",
      },
      {
        userId: 3,
        fullName: "DET. SARAH JENKINS",
        rank: "DETECTIVE",
        email: "jenkins@police.gov",
        completionPercentage: 45,
        lastActive: "1 ngày trước",
        role: "DETECTIVE",
      },
    ];
  },

  getStudentDossier: async (userId: number): Promise<StudentDossier> => {
    // Mocking API call
    return {
      userId,
      shownId: "88-092-ALPHA",
      fullName: userId === 2 ? "CADET-OFFICER KHAN" : "SGT. MARCUS THORNE",
      email: userId === 2 ? "khan@police.gov" : "marcus.thorne@police.gov",
      role: "STUDENT",
      dateOfBirth: "1995-05-20",
      rank: userId === 2 ? "CADET" : "OFFICER",
      proficiencyScore: 92,
      totalStudyTime: 142,
      accuracyRate: 94,
      unitProgress: [
        {
          unitId: 1,
          title: "Nhập môn giao tiếp nghiệp vụ",
          progress: 100,
          status: "completed",
          hasBadge: true,
        },
        {
          unitId: 2,
          title: "Điều tiết giao thông",
          progress: 100,
          status: "completed",
          hasBadge: true,
        },
        {
          unitId: 3,
          title: "Giao tiếp hiện trường",
          progress: 75,
          status: "in-progress",
          hasBadge: false,
        },
        {
          unitId: 4,
          title: "Phản ứng chiến thuật",
          progress: 0,
          status: "locked",
          hasBadge: false,
        },
      ],
      testHistory: [
        {
          testId: "t1",
          title: "Bài kiểm tra Chương 1",
          score: 98,
          total: 100,
          percentage: 98,
          date: "12/10",
        },
        {
          testId: "t2",
          title: "Bài kiểm tra Chương 2",
          score: 92,
          total: 100,
          percentage: 92,
          date: "15/10",
        },
        {
          testId: "t3",
          title: "Đánh giá giữa kỳ",
          score: 89,
          total: 100,
          percentage: 89,
          date: "20/10",
        },
      ],
    };
  },
};
