
import { Request, Response } from 'express';
import status from 'http-status';
import { firebaseMessaging } from '../../config/firebaseAdmin';

export const sendNotification = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      token,
      title,
      body,
      imageUrl,
      screen,
    } = req.body;

    // Validate required fields
    if (!token || !title || !body) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: 'Token, title and body are required',
      });
    }

    // Validate image URL if provided
    if (imageUrl) {
      try {
        const url = new URL(imageUrl);

        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          throw new Error('Invalid image URL protocol');
        }
      } catch {
        return res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Please provide a valid image URL',
        });
      }
    }

    // Notification navigation data
    const data: Record<string, string> = {
      screen: String(screen || 'Home'),
    };

    if (imageUrl) {
      data.imageUrl = String(imageUrl);
    }

    // Send Firebase Cloud Messaging
    const messageId = await firebaseMessaging.send({
      token: String(token),

      notification: {
        title: String(title),
        body: String(body),
        ...(imageUrl ? { imageUrl: String(imageUrl) } : {}),
      },

      data,

      android: {
        priority: 'high',

        notification: {
          channelId: 'eduquest-default',

          ...(imageUrl
            ? { imageUrl: String(imageUrl) }
            : {}),
        },
      },
    });

    return res.status(status.OK).json({
      success: true,
      message: 'Notification sent successfully',
      data: {
        messageId,
        screen: data.screen,
        imageUrl: imageUrl || null,
      },
    });

  } catch (error: any) {
    console.error('FCM Notification Error:', error);

    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message,
    });
  }
};
