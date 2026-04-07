import { db } from "@/lib/db";
import { NotificationType } from "@prisma/client";

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  actionUrl?: string
) {
  return db.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      actionUrl,
      isRead: false,
    },
  });
}
